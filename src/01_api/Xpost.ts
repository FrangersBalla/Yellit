import { db} from "../00_config/firebase"
import {
  getDocs,
  collection,
  addDoc,
  updateDoc,
  doc,
  query, where,
  serverTimestamp,
  orderBy, limit,
  Timestamp,
  increment,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";
import type { Doc } from '../02_lib/XTypes'


export const CreateNewPost = async (macroName: string, name: string, title: string, content: string, reactions: string[] = [], reviews: number = 0): Promise<number> => {
  const postCollectionRef = collection(db, 'posts')
  try {
    await addDoc(postCollectionRef, {
      macroName,
      name,
      title,
      content,
      createdAt: serverTimestamp(),
      popularityScore: Math.floor(Number(new Date()) / 3600000) - 482136,
      reactions,
      reviews,
    })
    return 0; // successo
  } catch (err) {
    return 2
  }
}

export const ShowPostsInMacro = async (macroName: string): Promise<Doc[]>  => {
  const q = query(
    collection(db, 'posts'),
    where('macroName', '==', macroName),
    orderBy('createdAt', 'desc'),
  )
  try {
    const data = await getDocs(q)
    const filteredData = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }))
    return filteredData
  } catch (err) {
    return []
  }
}

export const GlobalFeed = async (): Promise<Doc[]>  => {
  const q = query(
    collection(db, 'posts'),
    orderBy('createdAt', 'desc'),
    limit(20)
  )
  try {
    const data = await getDocs(q)
    const filteredData = data.docs.map((doc) => ({ 
      ...doc.data(),
      id: doc.id,
    })).sort((a: Doc, b: Doc) => b.popularityScore - a.popularityScore)
    return filteredData
  } catch (err) {
    return []
  }
}

export const AddLike = async (post: Doc, userName: string, macroName: string = post.macroName)=> {
  const postDocRef = doc(db, 'posts', post.id!)
  await updateDoc(postDocRef, {
    reactions: arrayUnion(userName),
    popularityScore: increment(72)
  })
  const likesCollectionRef = collection(db, 'likes')
  await addDoc(likesCollectionRef, {
    userName,
    createdAt: serverTimestamp(),
    macroName
  })
}

export const RemoveLike = async (post: Doc, userName: string)=> {
  const postDocRef = doc(db, 'posts', post.id!)
  await updateDoc(postDocRef, {
    reactions: arrayRemove(userName),
    popularityScore: increment(-72)
  })
}

export const AddComment = async (post: Doc, comment: string,  userName: string)=> {
  const postDocRef = doc(db, 'posts', post.id!)
  await updateDoc(postDocRef, {
    reviews: increment(1),
    popularityScore: increment(120)
  })
  const commentsCollectionRef = collection(db, 'comments')
  await addDoc(commentsCollectionRef, {
    comment,
    userName,
    createdAt: serverTimestamp(),
    post: post.id!,
    macroName: post.macroName
  })

}

export const ShowComments = async (post: Doc): Promise<Doc[]>=> {
  const q = query(
    collection(db, 'comments'),
    where('post', '==', post.id!),
  )
  try {
    const data = await getDocs(q)
    const filteredData = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }))
    return filteredData
  } catch (err) {
    return []
  }
}


export const getWeeklyUsage = async (macroName: string): Promise<[number[], number[], number[]]> => {
  const day = new Date().getDay()
  const diff = (day === 0 ? -6 : 1) - day
  const start = new Date()
  start.setHours(0, 0, 0, 0)
  start.setDate(start.getDate() + diff)
  const monday = Timestamp.fromDate(new Date(start))

  const postsByDay = new Array(7).fill(0)
  const commentsByDay = new Array(7).fill(0)
  const likesByDay = new Array(7).fill(0)

  try {
    const postsSnapshot = await getDocs(query(
      collection(db, 'posts'),
      where('macroName', '==', macroName),
      where('createdAt', '>=', monday)
    ))

    const likesSnapshot = await getDocs(query(
      collection(db, 'likes'),
      where('macroName', '==', macroName),
      where('createdAt', '>=', monday)
    ))

    const commentsSnapshot = await getDocs(query(
      collection(db, 'comments'),
      where('macroName', '==', macroName),
      where('createdAt', '>=', monday)
    ))

    postsSnapshot.docs.forEach((doc) => {
      const data = doc.data()
      if (data.createdAt?.toDate) {
        const day = data.createdAt.toDate().getDay()
        postsByDay[day === 0 ? 6 : day - 1]++
      }
    })

    likesSnapshot.docs.forEach((doc) => {
      const data = doc.data()
      if (data.createdAt?.toDate) {
        const day = data.createdAt.toDate().getDay()
        likesByDay[day === 0 ? 6 : day - 1]++
      }
    })

    commentsSnapshot.docs.forEach((doc) => {
      const data = doc.data()
      if (data.createdAt?.toDate) {
        const day = data.createdAt.toDate().getDay()
        commentsByDay[day === 0 ? 6 : day - 1]++
      }
    })

    return [postsByDay, likesByDay, commentsByDay]
  } catch (error) {
    console.error("Errore in getWeeklyUsage:", error)
    return [postsByDay, likesByDay, commentsByDay]
  }
}

export const getLikesSubscriptionStatus = async (macroName: string, members: Set<string>): Promise<[number, number]> => {
  const res: [number, number] = [0, 0]
  try {
    const q = query(
      collection(db, 'likes'),
      where('macroName', '==', macroName),
    )
    const data = await getDocs(q)

    data.docs.forEach(doc => {
      const like = doc.data()
      if (members.has(like.userName)) res[0]++
      else res[1]++
    })

    return res
  } catch (err) {
    return [0, 0]
  }
}
