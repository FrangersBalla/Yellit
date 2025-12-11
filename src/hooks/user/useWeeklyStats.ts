import { useState, useEffect } from 'react'
import { getWeeklyStats } from '../../services/weeklyStatsService'

interface DailyMetrics {
  date: string
  postsPublished: number
  likesReceived: number
  commentsReceived: number
}

export const useWeeklyStats = (userName: string | null) => {
  const [metrics, setMetrics] = useState<DailyMetrics[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!userName) {
        setLoading(false)
        return
      }
      try {
        const [posts, likes, comments] = await getWeeklyStats(userName)
        const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        const formatted = weekdays.map((day, i) => ({
          date: day,
          postsPublished: posts[i],
          likesReceived: likes[i],
          commentsReceived: comments[i]
        }))
        setMetrics(formatted)
      } catch (e) {
        console.log(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [userName])

  return { metrics, loading }
}