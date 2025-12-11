import { useState, useEffect, useCallback } from 'react'
import { markNotificationAsRead } from '../services/notificationServices'
import { collection, query, where, onSnapshot, limit } from 'firebase/firestore'
import { db } from '../config/firebase'
import type { Notification } from '../types/notification'
import { displayNotification } from '../utils/browserNotifications'
import { useAuth } from "../context/AuthContext"

export const useNotifications = () => {

  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [previousCount, setPreviousCount] = useState(0)
  const { currentUser } = useAuth()

  const notificationsListener = useCallback(() => {
    if (!currentUser?.userName) return () => {} // Restituisci una funzione vuota se non c'è user
    
    setLoading(true)
    const notificationsRef = collection(db, 'notifications')
    const q = query(notificationsRef, where('to', '==', currentUser.userName), where('readed', '==', false), limit(10))
    
    const unsub = onSnapshot(q, (querySnapshot) => {
      const n: Notification[] = []
      querySnapshot.forEach((doc) => {
        n.push({
          id: doc.id,
          ...doc.data(),
        } as Notification)
      })
      setNotifications(n)
      if (notifications.length > previousCount) {
        displayNotification() // notifica browser (solo se hai nuove notifiche)
      }
      setPreviousCount(notifications.length)
      setLoading(false)
    }, (e) => {
      console.log(e)
      setLoading(false)
    })

    return unsub // chiudi il listener
  }, [currentUser?.userName, previousCount])

  useEffect(() => {
    if (!currentUser?.userName) {
      setLoading(false)
      setNotifications([])
      return
    }

    const unsubscribe = notificationsListener()
    return () => {
      if (unsubscribe) unsubscribe() // unsubscribe all'unmount
    }
  }, [currentUser?.userName, notificationsListener])

  const Read = async (notificationId: string) => {
    await markNotificationAsRead(notificationId)
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, readed: true } : n)
    )
  }

  return { notifications, loading, Read }
}