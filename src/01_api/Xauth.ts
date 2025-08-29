import { db, auth, googleAuth } from '../00_config/firebase'
import { signInWithPopup, signOut, getAuth } from 'firebase/auth'
import type { User } from '../02_lib/XTypes'

import {
  getDocs,
  collection,
  addDoc,
  updateDoc,
  doc,
  query, where
} from "firebase/firestore"

export const GoogleLogIn = async (): Promise<User> => {
    try{
        const userCollectionRef = collection(db, 'users')
        const res = await signInWithPopup(auth, googleAuth)
        const querySnapshot = await getDocs(query(userCollectionRef, where("uID", "==", res.user.uid)))
        if(querySnapshot.empty) {
            const nickName = String(res.user.displayName).replace(/\s+/g, "").toLowerCase()
            const user:User = {
                uID: res!.user!.uid,
                email: res!.user!.email!,
                nickName,
                isNew: true
            }
            await addDoc(userCollectionRef, user)
            return user
        }
        else return {
            nickName: querySnapshot.docs[0]!.data()!.nickName!,
            email: querySnapshot.docs[0]!.data()!.email,
            isNew: querySnapshot.docs[0]!.data()!.isNew,
            uID: querySnapshot.docs[0]!.data()!.uID,
        }
    } catch(err){
        return {
            nickName: '',
            email: '',
            isNew: false,
            uID: '',
        }
    }
}


export const LogOut = async ()=>{
    try{
        await signOut(auth)
    }catch(err){}
}

export const SearchUser = async (uID: string): Promise<User>=>{
    try{
        const userCollectionRef = collection(db, 'users')
        const user = await getDocs(query(userCollectionRef, where("uID", "==", uID)))
        return {
            nickName: user.docs[0]!.data()!.nickName!,
            email: user.docs[0]!.data()!.email,
            isNew: user.docs[0]!.data()!.isNew,
            uID: user.docs[0]!.data()!.uID,
        }
    }
    catch(err){
        return {
            nickName: '',
            email: '',
            isNew: false,
            uID: '',
        }
    }
}

export const UserExist = async (nickName: string): Promise<boolean>=> {
    try{
        const userCollectionRef = collection(db, 'users')
        const user = await getDocs(query(userCollectionRef, where('nickName', '==', nickName)))
        return !user.empty
    }
    catch(err){
        return false
    }
}

export const SingUpOndb = async (nickName: string, birthday: string, country: string, sex: string)=>{
    const auth = getAuth()
    const q = await getDocs(query(collection(db, "users"), where("uID", "==", auth!.currentUser!.uid)))
    const userDocRef = doc(db, 'users', q.docs[0].id)
    await updateDoc(userDocRef, {
        nickName,
        birthday,
        country,
        sex,
        isNew: false
    })
}
