import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { getWeeklyUsage } from '../01_api/Xpost'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

interface DailyMetrics {
  date: string
  likesPublished: number
  commentsPublished: number
  postsPublished: number
  likesReceived: number
  commentsReceived: number
  postsReceived: number
}

interface WeeklyChartProps {
  macroName: string
  page: number
}

export default function WeeklyUsage ({ macroName, page}: WeeklyChartProps){
  const [metrics, setMetrics] = useState<DailyMetrics[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [posts, likes, comments] = await getWeeklyUsage(macroName)
        console.log([posts, likes, comments])
        const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        const formatted = weekdays.map((day, i) => ({
          date: day,
          postsPublished: posts[i],
          likesReceived: likes[i],
          commentsReceived: comments[i],
          postsReceived: 0,
          likesPublished: 0,
          commentsPublished: 0
        }))
        setMetrics(formatted)
      } catch (error) {
      } finally {
        setLoading(false)
      }
    }
    if (page == 5) fetchData()
  }, [macroName, page])

  const data = {
    labels: metrics.map(m => m.date),
    datasets: [
      {
        label: 'Posts Published',
        data: metrics.map(m => m.postsPublished),
        borderColor: 'rgba(190, 161, 15, 1)',
        tension: 0.4
      },
      {
        label: 'Likes Received',
        data: metrics.map(m => m.likesReceived),
        borderColor: 'rgba(192, 75, 139, 1)',
        tension: 0.4
      },
      {
        label: 'Comments Received',
        data: metrics.map(m => m.commentsReceived),
        borderColor: 'rgba(64, 121, 255, 1)',
        tension: 0.4
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const
      },
      title: {
        display: true,
        text: '(Weekly)'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
        suggestedMax: 5
      }
    }
  }

  if (loading || metrics.length === 0) return null

  return (
    <div className="bg-zinc-950 rounded-lg mb-4 p-4">
      <div className="text-amber-200 font-medium text-md mb-2">Channel Performance</div>
      <Line data={data} options={options} />
    </div>
  )
}

