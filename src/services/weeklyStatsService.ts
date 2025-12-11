import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../config/firebase'
import { Timestamp } from 'firebase/firestore'

export const getWeeklyStats = async (userName: string): Promise<[number[], number[], number[]]> => {
  const day = new Date().getDay() //(0=domenica, 1=lunedì, ..., 6=sabato)
  // se è domenica (0), vado indietro di 6 giorni -> lunedi precedente
  // altrimenti calcolo quanti giorni sono passati da lunedi e li sottraggo per tornare a inizio settimana
  const diff = (day == 0 ? -6 : 1) - day
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() + diff)
  const monday = Timestamp.fromDate(start)

  const postsByDay = new Array(7).fill(0) // array per contare quanti * ogni giorno della settimana
  const likesByDay = new Array(7).fill(0)
  const commentsByDay = new Array(7).fill(0)

  try {
    const postsSnapshot = await getDocs(query(
      collection(db, 'posts'),
      where('name', '==', userName),
      where('createdAt', '>=', monday) // tutti i post della settimana
    ))

    const likesSnapshot = await getDocs(query(
      collection(db, 'likes'),
      where('to', '==', userName),
      where('createdAt', '>=', monday)
    ))

    const commentsSnapshot = await getDocs(query(
      collection(db, 'comments'),
      where('to', '==', userName),
      where('createdAt', '>=', monday)
    ))

    postsSnapshot.docs.forEach((doc) => {
      const data = doc.data()
      if (data.createdAt?.toDate) {
        // recupero il giorno della settimana del post
        const day = data.createdAt.toDate().getDay()
        // lunedi -> 0 .... domenica -> 6 
        postsByDay[day == 0 ? 6 : day - 1] ++ // incremento
      }
    })

    likesSnapshot.docs.forEach((doc) => {
      const data = doc.data()
      if (data.createdAt?.toDate) {
        const day = data.createdAt.toDate().getDay()
        likesByDay[day == 0 ? 6 : day - 1]++
      }
    })

    commentsSnapshot.docs.forEach((doc) => {
      const data = doc.data()
      if (data.createdAt?.toDate) {
        const day = data.createdAt.toDate().getDay()
        commentsByDay[day == 0 ? 6 : day - 1]++
      }
    })

    return [postsByDay, likesByDay, commentsByDay]
  } catch (e) {
    console.log(e)
    return [postsByDay, likesByDay, commentsByDay]
  }
}