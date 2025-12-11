import { db } from '../config/firebase'
import { doc, runTransaction, arrayUnion, arrayRemove, getDoc, collection, getDocs } from 'firebase/firestore'

export const followUser = async (currentUserUid: string,targetUserName: string,targetUid: string ): Promise<void> => {
  // operazione atomica su follower e following
  await runTransaction(db, async (transaction) => {
    //cerco la subcollection per targetUid e prendo se esiste il documento con id currentUserUid
    const followerRef = doc(db, 'followers', targetUid, 'followers', currentUserUid)
    const followerSnap = await transaction.get(followerRef) // come getDoc()

    const followingRef = doc(db, 'following', currentUserUid) // recupero array con i seguiti dall'utente
    const followingSnap = await transaction.get(followingRef)

    if (followerSnap.exists()) {
      // se è gia seguito unfollow
      transaction.delete(followerRef) //elimino il documento dalla subcoll
      if (followingSnap.exists()) {
        transaction.update(followingRef, {
          followingUserNames: arrayRemove(targetUserName) // operazione su array atomica
        })
      }
    } else {
      transaction.set(followerRef, {}) // basta id = currentUserUid
      if (followingSnap.exists()) {
        transaction.update(followingRef, { // updateDoc()
          followingUserNames: arrayUnion(targetUserName) // evito duplicati
        })
      } else {
        transaction.set(followingRef, { // solo la prima volta
          followingUserNames: [targetUserName]
        })
      }
    }
  })
}

export const getFollowingUsers = async (uid: string): Promise<string[]> => {
  const followingRef = doc(db, 'following', uid)
  const followingSnap = await getDoc(followingRef)

  if (followingSnap.exists()) {
    return followingSnap.data()?.followingUserNames || []
  } else {
    return []
  }
}

export const getFollowers = async (uid: string): Promise<string[]> => {
  const followersRef = collection(db, 'followers', uid, 'followers')
  const followersSnap = await getDocs(followersRef)
  return followersSnap.docs.map(doc => doc.id)
}