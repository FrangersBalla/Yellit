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
import { useWeeklyStats } from '../../hooks/user/useWeeklyStats'
import { useAuth } from '../../context/AuthContext'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function WeeklyStats() {
  const { currentUser } = useAuth()
  const { metrics, loading } = useWeeklyStats(currentUser?.userName || null)

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
        text: 'Weekly Stats'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
        suggestedMax: 10
      }
    }
  }

  if (loading || metrics.length === 0) return null

  return (
    <div className="bg-zinc-950 rounded-lg mb-4 p-4">
      <div className="text-amber-200 font-medium text-md mb-2">Weekly Performance</div>
      <Line data={data} options={options} />
    </div>
  )
}