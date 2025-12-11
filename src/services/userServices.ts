import { db } from '../config/firebase'
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore'

export const getUserByUsername = async (userName: string) => {
  const usersRef = collection(db, 'users')
  const q = query(usersRef, where('userName', '==', userName))
  const userSnap = await getDocs(q)

  if (!userSnap.empty) {
    const doc = userSnap.docs[0]
    return { uid: doc.id, ...doc.data() }
  }

  return null
}

export const getUserNamesByUids = async (uids: string[]): Promise<string[]> => {
  const userNames: string[] = []
  for (const uid of uids) {
    const userSnap = await getDoc(doc(db, 'users', uid))
    if (userSnap.exists()) {
      userNames.push(userSnap.data().userName)
    }
  }
  return userNames
}