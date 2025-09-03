import { useEffect, useState } from 'react'
import { Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import { getLikesSubscriptionStatus } from '../01_api/Xpost' // da creare

ChartJS.register(ArcElement, Tooltip, Legend)

interface LikesPieProps {
  macroName: string
  page: number
  mems: Set<string>
}

export default function LikesPie({ macroName, page, mems }: LikesPieProps) {
  const [data, setData] = useState<[number, number]>([0,0])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const result = await getLikesSubscriptionStatus(macroName, mems)
        setData(result)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    if (page !== 5) return
    if (!mems || mems.size === 0) {
        setLoading(false)
        return
    }
    fetchData()
  }, [mems, page])

  if (loading) return null

  const chartData = {
    labels: ['Subscribed', 'Unsubscribed'],
    datasets: [
      {
        data: [data[0], data[1]],
        backgroundColor: ['#680508ff', '#f8d671ff'],
        hoverBackgroundColor: ['#eb2525ff', '#edca31ff']
      }
    ]
  }

  const options = {
    plugins: {
      legend: {
        position: 'right' as const
      },
      title: {
        display: false,
        text: ''
      }
    }
  }

  return (
    <div className="bg-zinc-950 rounded-lg md:h-128 mb-4 p-12">
      <div className="text-amber-200 font-medium text-md mb-2">Likes: Subscribed vs Unsubscribed</div>
      <Pie data={chartData} options={options} />
    </div>
  )
}
