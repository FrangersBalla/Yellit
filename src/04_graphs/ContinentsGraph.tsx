import { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

interface ContinentChartProps {
  userDistr: string[]
  page: number
}

export default function ContinentChart({ userDistr, page }: ContinentChartProps) {
  const continents: Record<string, number> = {
    Europe: 0,
    Asia: 1,
    NorthAmerica: 2,
    SouthAmerica: 3,
    Africa: 4,
    Oceania: 5,
    Antarctica: 6,
  }

  const [distr, setDistr] = useState<number[]>([])

  useEffect(() => {
    if (page !== 5) return

    const counts = new Array(7).fill(0) // partiamo da zero ora
    for (let e of userDistr) {
      const temp = continents[e as keyof typeof continents]
      if (temp !== undefined) counts[temp]++
    }

    setDistr(counts)
  }, [page, userDistr])

  const data = {
    labels: [
      'Europe',
      'Asia',
      'North America',
      'South America',
      'Africa',
      'Oceania',
      'Antarctica'
    ],
    datasets: [
      {
        label: '',
        data: distr,
        backgroundColor: [
          '#fa158bff',
          '#072e91ff',
          '#ef4444',
          '#10b981',
          '#a855f7',
          '#facc15',
          '#5a452dff'
        ]
      }
    ]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
        display: false
      },
      title: {
        display: false,
        text: ''
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  }

  return (
    <div className="bg-zinc-950 rounded-lg md:h-128 mb-4 p-6">
      <div className="text-amber-200 font-medium text-md mb-2">Geographic Distribution</div>
      <Bar data={data} options={options} />
    </div>
  )
}
