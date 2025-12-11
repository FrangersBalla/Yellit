import { useEffect, useState } from 'react'

export function useLoadingTimeout(timeoutMs: number = 10) {
  const [showSkeletons, setShowSkeletons] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeletons(false)
    }, timeoutMs)

    return () => clearTimeout(timer)
  }, [timeoutMs])

  return showSkeletons
}