import { db} from "../00_config/firebase";
import { CreateNewMacroError } from './Xerror'
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  query, where, 
  serverTimestamp,
  arrayUnion
} from "firebase/firestore";
import type { Doc } from '../02_lib/XTypes'


export const CreateNewMacro = async (macroName: string, count: number, uID: string, nickName: string, description: string, topic: string): Promise<number> => {
  const macroCollectionRef = collection(db, 'macros')
  
  try {
    if(macroName.length < 3) throw new CreateNewMacroError('Nome troppo corto.')
    const querySnapshot = await getDocs(query(macroCollectionRef, where('macroName', '==', macroName)))
    if (!querySnapshot.empty) throw new CreateNewMacroError('Esiste già una macro con questo nome.')
    await addDoc(macroCollectionRef, {
      macroName,
      MembersNum: count,
      description,
      topics: arrayUnion(topic)
    })
    await AddMembership (macroName, uID, 'Owner', nickName)
    return 0; // successo
  } catch (err) {
    if (err instanceof CreateNewMacroError) return 1
    return 2
  }
}

export const AddMembership = async (macroName: string, uID: string, role: string, nickName: string, macroList:Doc[] = [], MembersNum: number = 0)=>{
  const membershipsCollectionRef = collection(db, 'memberships')
  const AlreadyJoined = macroList.find((e)=>e.macroName === macroName)
  if (!AlreadyJoined) {
    await addDoc(membershipsCollectionRef, {
      macroName,
      role,
      uID,
      userName: nickName,
      joinedAt: serverTimestamp()
    })
    await IncreaseMemsNum(macroName, MembersNum)
  }
}

export const IncreaseMemsNum = async (macroName: string, MembersNum: number = 0)=>{
  const q = await getDocs(query(collection(db, "macros"), where("macroName", "==", macroName)))
  const macroDocRef = doc(db, 'macros', q.docs[0].id)
  await updateDoc(macroDocRef, {
    MembersNum: MembersNum+1
  })
}

export const ExposeMacros = async (uID: string): Promise<Doc[]>  => {
  const q = query(
    collection(db, 'memberships'),
    where('uID', '==', uID)
  )

  try {
    const data = await getDocs(q)
    const filteredData = data.docs.map((doc) => ({
      ...doc.data(),
    }))
    return filteredData
  } catch (err) {
    return []
  }
}

export const GetMacroInfo = async (macroName: string): Promise<Doc[]> => {
  const q = query(
    collection(db, 'macros'),
    where('macroName', '==', macroName)
  )
  try {
    const data = await getDocs(q)
    const filteredData = data.docs.map((doc) => ({
      ...doc.data(),
    }))
    return filteredData
  } catch (err) {
    return []
  }
}

export const AddRole = async (memID: string, role: string = 'Supervisor') =>{
  const macroDocRef = doc(db, 'memberships', memID)
  await updateDoc(macroDocRef, {
    role
  })
}

export const PopolareMacros = async (): Promise<string[]> => {
  const q = query(
    collection(db, 'macros')
  )
  try {
    const data = await getDocs(q)
    const filteredData = data.docs.map((doc) => ({
      ...doc.data(),
    })).map((e)=>e.macroName)
    return filteredData
  } catch (err) {
    return []
  }
}

export const ShowMembers = async (macroName: string): Promise<Doc[]> => {
  const q = query(
    collection(db, 'memberships'),
    where('macroName', '==', macroName)
  )
  try {
    const data = await getDocs(q)
    const filteredData = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id
    }))
    return filteredData
  } catch (err) {
    return []
  }
}

export const RemoveAccount = async (memID: string, macroName: string, MembersNum: number) =>{
  await deleteDoc(doc(db, 'memberships', memID))
  const q = await getDocs(query(collection(db, "macros"), where("macroName", "==", macroName)))
  const macroDocRef = doc(db, 'macros', q.docs[0].id)
  await updateDoc(macroDocRef, {
    MembersNum: MembersNum - 1
  })
}

export const loadTopics = async (): Promise<string[]> => {
    try {
      const querySnapshot = await getDocs(collection(db, 'topics'));
      const loadedTopics = querySnapshot.docs.map(doc => ({
        ...doc.data(),
      }))
      return loadedTopics.map((doc)=>doc.name)
    } catch (error) {
      return []
    }
  }