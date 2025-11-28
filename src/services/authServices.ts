import { db, auth } from '../config/firebase'
import { signInWithPopup, signOut, getAuth } from 'firebase/auth'
import type { User } from '../types/authType'
import { GoogleAuthProvider } from 'firebase/auth/web-extension'
import {
  getDocs,
  collection,
  updateDoc,
  doc,
  query,
  where,
} from 'firebase/firestore'

export const googleLogIn = async (emailInput: string): Promise<User | null> => {
  try {
    const provider = new GoogleAuthProvider()
    provider.setCustomParameters({ prompt: 'select_account' })

    const result = await signInWithPopup(auth, provider)
    const googleEmail = result.user.email

    if (!googleEmail || googleEmail != emailInput) {
      await auth.signOut()
      throw new Error('Account selezionato diverso dalla mail inserita')
    }

    const usersRef = collection(db, 'users')
    const q = query(usersRef, where('email', '==', googleEmail))
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      console.warn('Utente non trovato in Firestore')
      return null
    }

    const userData = snapshot.docs[0].data()
    return {
      email: userData.email,
      userName: userData.nickName,
      language: userData.language ?? '',
      provider: 'Google'
    }
  } catch (err) {
    console.error('Errore durante il login con Google:', err)
    return null
  }
}


export const LogOut = async (): Promise<void> => {
  try {
    await signOut(auth)
  } catch (err) {
    console.error('LogOut error', err)
  }
}

export const SearchUser = async (userName: string): Promise<User | null> => {
  try {
    const ref = collection(db, 'users')
    const snapshot = await getDocs(query(ref, where('userName', '==', userName)))

    if (snapshot.empty) return null

    const data = snapshot.docs[0].data()

    return {
      email: data.email,
      userName: data.nickName,
      language: '',
      provider: ''
    }
  } catch (err) {
    console.error('SearchUser error', err)
    return null
  }
}

export const UserExist = async (nickName: string): Promise<string> => {
  try {
    const snapshot = await getDocs(
      query(collection(db, 'users'), where('nickName', '==', nickName))
    )
    return !snapshot.empty? snapshot.docs[0].data().provider : ''
  } catch (err) {
    console.error('UserExist error', err)
    return ''
  }
}

export const SingUpOndb = async (userName: string, email: string, language: string): Promise<void> => {
  try {
    const authData = getAuth()
    const uid = authData.currentUser?.uid
    if (!uid) return

    const snapshot = await getDocs(
      query(collection(db, 'users'), where('uid', '==', uid))
    )

    if (snapshot.empty) return

    const userDocId = snapshot.docs[0].id
    const userDocRef = doc(db, 'users', userDocId)

    await updateDoc(userDocRef, {
      userName,
      language,
      isNew: false,
    })
  } catch (err) {
    console.error('SingUpOndb error', err)
  }
}
