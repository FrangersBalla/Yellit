import { collection, addDoc, query, where, getDocs, doc, runTransaction, arrayUnion, getDoc } from 'firebase/firestore'
import { db } from '../config/firebase'
import type { Topic } from '../types/topic'
import type { Membership } from '../types/membership'

// Search for similar topics in the database
export const searchTopics = async (searchQuery: string): Promise<string[]> => {
  const topicsRef = collection(db, 'topics')
  const q = query(topicsRef)
  const querySnapshot = await getDocs(q)

  const allTopics: string[] = []
  querySnapshot.forEach((doc) => {
    const data = doc.data()
    allTopics.push(data.name)
  })

  // Filter topics that contain the search query (case insensitive)
  return allTopics
    .filter(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 5) // Return top 5 matches
}

// Create a new topic and add membership for the user
export const createTopic = async (name: string, userName: string): Promise<string> => {
  const topicsRef = collection(db, 'topics')
  const q = query(topicsRef, where('name', '==', name))
  const querySnapshot = await getDocs(q)

  let topicId: string
  
  if (!querySnapshot.empty) {
    // Topic exists, get its ID
    const topicDoc = querySnapshot.docs[0]
    topicId = topicDoc.id
  } else {
    // Create new topic
    const topicDoc = await addDoc(topicsRef, {
      name,
      memberCount: 0
    })
    topicId = topicDoc.id
  }

  // Add membership using transaction
  await runTransaction(db, async (transaction) => {
    // First, read the topic doc
    const topicDocRef = doc(db, 'topics', topicId)
    const topicSnap = await transaction.get(topicDocRef)

    // Then read membership
    const membershipDocRef = doc(db, 'memberships', userName)
    const membershipSnap = await transaction.get(membershipDocRef)

    // Now perform writes
    if (membershipSnap.exists()) {
      // Se il documento esiste, aggiorna aggiungendo il name all'array followedTopics (senza duplicati grazie a arrayUnion)
      transaction.update(membershipDocRef, {
        followedTopics: arrayUnion(name)
      })
    } else {
      // Se il documento non esiste, crealo con userName e l'array contenente il name
      transaction.set(membershipDocRef, {
        userName,
        followedTopics: [name]
      } as Membership)
    }

    // Incrementa il conteggio membri del topic
    if (topicSnap.exists()) {
      const currentCount = topicSnap.data().memberCount || 0
      transaction.update(topicDocRef, {
        memberCount: currentCount + 1
      })
    }
  })

  return topicId
}

// Unfollow a topic and remove membership for the user
export const unfollowTopic = async (name: string, userName: string): Promise<void> => {
  const topicsRef = collection(db, 'topics')
  const q = query(topicsRef, where('name', '==', name))
  const querySnapshot = await getDocs(q)

  if (querySnapshot.empty) {
    throw new Error('Topic not found')
  }

  const topicDoc = querySnapshot.docs[0]
  const topicId = topicDoc.id

  // Remove membership using transaction
  await runTransaction(db, async (transaction) => {
    // First, read the topic doc
    const topicDocRef = doc(db, 'topics', topicId)
    const topicSnap = await transaction.get(topicDocRef)

    // Then read membership
    const membershipDocRef = doc(db, 'memberships', userName)
    const membershipSnap = await transaction.get(membershipDocRef)

    if (!membershipSnap.exists()) {
      throw new Error('Membership not found')
    }

    // Remove the topic from followedTopics
    const currentTopics = membershipSnap.data()?.followedTopics || []
    const updatedTopics = currentTopics.filter((topic: string) => topic !== name)

    transaction.update(membershipDocRef, {
      followedTopics: updatedTopics
    })

    // Decrement the member count of the topic
    if (topicSnap.exists()) {
      const currentCount = topicSnap.data().memberCount || 0
      transaction.update(topicDocRef, {
        memberCount: Math.max(0, currentCount - 1)
      })
    }
  })
}

// Get topic by name
export const getTopicById = async (topicName: string): Promise<Topic | null> => {
  const q = query(collection(db, 'topics'), where('name', '==', topicName))
  const querySnapshot = await getDocs(q)
  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0]
    const data = doc.data()
    return { id: doc.id, name: data.name, memberCount: data.memberCount }
  }
  return null
}

// Get all members (userNames) of a topic
export const getMembersOfTopic = async (topicName: string): Promise<string[]> => {
  const membershipsRef = collection(db, 'memberships')
  const q = query(membershipsRef, where('followedTopics', 'array-contains', topicName))
  const querySnapshot = await getDocs(q)
  const members: string[] = []
  querySnapshot.forEach((doc) => {
    const data = doc.data()
    members.push(data.userName)
  })
  return members
}

// Get followed topics for a user
export const getFollowedTopics = async (userName: string): Promise<string[]> => {
  const membershipDocRef = doc(db, 'memberships', userName)
  const membershipSnap = await getDoc(membershipDocRef)
  if (membershipSnap.exists()) {
    return membershipSnap.data()?.followedTopics || []
  }
  return []
}

// Search topics by exact name
export const searchTopicsByName = async (name: string): Promise<Topic[]> => {
  const q = query(collection(db, 'topics'), where('name', '==', name))
  const querySnapshot = await getDocs(q)
  const topics: Topic[] = []
  querySnapshot.forEach((doc) => {
    const data = doc.data()
    topics.push({ id: doc.id, name: data.name, memberCount: data.memberCount })
  })
  return topics
}