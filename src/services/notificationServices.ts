import { collection, addDoc, query, where, getDocs, updateDoc, doc, serverTimestamp } from 'firebase/firestore'
import { db } from '../config/firebase'
import type { Notification } from '../types/notification'

export const getNotifications = async (userName: string): Promise<Notification[]> => {
  const notificationsRef = collection(db, 'notifications')
  const q = query(notificationsRef, where('to', '==', userName))
  try {
    const notificationsSnap = await getDocs(q)
    const notifications: Notification[] = []
    notificationsSnap.forEach((doc) => {
      notifications.push({
        id: doc.id,
        ...doc.data(),
      } as Notification)
    })
    return notifications
  } catch (err) {
    return []
  }
}

export const createNotification = async (notification: Omit<Notification, 'id' | 'createdAt'>): Promise<void> => {
  const notificationsRef = collection(db, 'notifications')
  try {
    await addDoc(notificationsRef, {
      ...notification,
      createdAt: serverTimestamp(),
    })
  } catch (e) {
    console.log(e)
  }
}

export const markNotificationAsRead = async (notificationId: string): Promise<void> => {
  const notificationRef = doc(db, 'notifications', notificationId)
  try {
    await updateDoc(notificationRef, {
      readed: true,
    })
  } catch (e) {
  }
}