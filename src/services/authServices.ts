import { db, auth, googleAuth } from '../config/firebase'
import { signInWithPopup, signOut } from 'firebase/auth'
import type { User } from '../types/Type'
import {
  getDocs,
  collection,
  query,
  where,
  updateDoc,
  doc,
  setDoc,
} from 'firebase/firestore'


export const GoogleLogIn = async (email: string): Promise<User> => {

  const res = await signInWithPopup(auth, googleAuth)
  const googleEmail = res.user.email ?? ''

  if (googleEmail != email) {
    await auth.signOut()
    throw new Error('email selezionata diversa da quella inserita')
  }

  const usersRef = collection(db, 'users')
  const q = query(usersRef, where("email", "==", email))
  const userSnap = await getDocs(q)

  if (userSnap.empty) {
    await auth.signOut()
    throw new Error('email selezionata diversa da quella inserita')
  } else {
    const data = userSnap.docs[0].data()
    return {
      uid: res.user.uid,
      email: data.email,
      userName: data.userName,
      language: data.language ?? '',
      provider: data.provider ?? '',
      notify: data.notify
    }
  }
}



export const LogOut = async (): Promise<void> => {
  try {
    await signOut(auth)
  } catch (e) {
    console.log(e)
  }
}

export const SearchUser = async (email: string): Promise<User | null> => {
  try {
    const usersRef = collection(db, 'users')
    const q = query(usersRef, where('email', '==', email))
    const userSnap = await getDocs(q)

    if (userSnap.empty) return null
    const data = userSnap.docs[0].data()

    return {
      uid: data.uid ?? userSnap.docs[0].id,
      email: data.email ?? email,
      userName: data.userName,
      language: data.language ?? '',
      provider: data.provider ?? '',
      notify: data.notify
    }
  } catch (e) {
    return null
  }
}

export const UserExist = async (userName: string): Promise<boolean> => {
  try {
    const usersRef = collection(db, 'users')
    const q = query(usersRef, where('userName', '==', userName))
    const userSnap = await getDocs(q)
    return !userSnap.empty
  } catch (e) {
    return false
  }
}

export const EmailExist = async (email: string): Promise<string> => {
  try {
    const usersRef = collection(db, 'users')
    const q = query(usersRef, where('email', '==', email))
    const userSnap = await getDocs(q)
    return !userSnap.empty? userSnap.docs[0].data().provider : '' // se esiste restituisco il provider (es. Google)

  } catch (err) {
    return ''
  }
}

export const GoogleSignUp = async (email: string, userName: string, language: string): Promise<User> => {
  const res = await signInWithPopup(auth, googleAuth)
  const googleEmail = res.user.email ?? ''

  if (googleEmail != email) {
    await auth.signOut()
    throw new Error('email selezionata diversa da quella inserita')
  }

  const usersRef = collection(db, 'users')
  const q = query(usersRef, where("email", "==", email))
  const userSnap = await getDocs(q)

  if (!userSnap.empty) {
    await auth.signOut()
    throw new Error('email già registrata')
  }

  try {
    await setDoc(doc(db, "users", res.user.uid), {
      uid: res.user.uid,
      userName,
      email,
      language,
      provider: 'Google',
      notify: true
    })

    const followingDoc = doc(db, 'following', res.user.uid)
    await setDoc(followingDoc, { followingUserNames: [] }) // array vuoto per i seguiti

  } catch (e) {
    throw e
  }

  return {
    uid: res.user.uid,
    email,
    userName,
    language,
    provider: 'Google',
    notify: true
  }
}

export const updateUserLanguage = async (uid: string, language: string): Promise<void> => {
  try {
    const userRef = doc(db, 'users', uid)
    await updateDoc(userRef, { language })
  } catch (e) {
    throw e
  }
}

export const updateUserNotify = async (uid: string, notify: boolean): Promise<void> => {
  try {
    const userRef = doc(db, 'users', uid)
    await updateDoc(userRef, { notify })
  } catch (e) {
    throw e
  }
}


