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
    limit(10)
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

export const AddLike = async (post: Doc, userName: string)=> {
  const postDocRef = doc(db, 'posts', post.id!)
  await updateDoc(postDocRef, {
    reactions: arrayUnion(userName),
    popularityScore: increment(72)
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
    post: post.id!
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