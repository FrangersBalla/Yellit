import { db } from '../config/firebase'
import {
  getDocs,
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  serverTimestamp,
  orderBy,
  limit,
  startAfter,
  increment,
  DocumentSnapshot,
  setDoc,
  getDoc,
  deleteDoc,
} from 'firebase/firestore'
import type { Post } from '../types/post'
import type { PostComment } from '../types/postComment'
import type { like } from '../types/like'
import { extractMentions } from '../utils/parseMarkdown'
import { createNotification } from './notificationServices'


export const searchPostsByTitle = async (q: string): Promise<Post[]> => {
  const postsRef = collection(db, 'posts')
  const searchQuery = query(postsRef, where('title', '>=', q), limit(5))
  const res = await getDocs(searchQuery)
  return res.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post))
}


export const CreateNewPost = async (name: string, title: string, content: string, reviews: number = 0, uid: string, topic?: string,): Promise<string | null> => {
  const postCollectionRef = collection(db, 'posts')
  try {
    const docRef = await addDoc(postCollectionRef, {
      name,
      uid,
      title,
      content,
      createdAt: serverTimestamp(),
      popularityScore: Math.floor(Number(new Date()) / 3600000) - 482136,
      reviews,
      ...(topic && { topic }),
      ...(uid && { uid }),
    })

    // crea notifiche per le menzioni nel contenuto del post
    const mentions = extractMentions(content)
    for (const mention of mentions) {
      if (mention != name) {
        await createNotification({
          from: name,
          to: mention,
          action: `${name} mentioned you on ${title}!`,
          postId: docRef.id,
          readed: false,
        })
      }
    }

    return docRef.id
  } catch (e) {
    console.log(e)
    return null
  }
}

// return array di post e l'ultimo post
export const GlobalFeed = async (last?: DocumentSnapshot): Promise<{ posts: Post[], last: DocumentSnapshot | null }> => {
  const q = last ? query(collection(db, 'posts'), orderBy('popularityScore', 'desc'), startAfter(last), limit(10))
    : query(collection(db, 'posts'), orderBy('popularityScore', 'desc'), limit(10))
  try {
    const res = await getDocs(q)
    const arr = res.docs
      .map((doc) => ({
        ...doc.data(),
        id: doc.id,
      } as Post))
    return { posts: arr as Post[], last: res.docs[res.docs.length - 1] || null }
  } catch (e) {
    console.log(e)
    return { posts: [], last: null }
  }
}

export const toggleLike = async (postId: string, userUid: string, postAuthorUserName: string, userName: string) => {
  const likeRef = doc(db, 'likes', `${postId}_${userUid}`) // relazione post-utente
  const postRef = doc(db, 'posts', postId)
  try {
    const likeSnap = await getDoc(likeRef)
    if (likeSnap.exists()) { // se il like esiste
      const res = likeSnap.data() as like 
      const liked = !res.isLiked // toggle prev => !prev
      await updateDoc(likeRef, { isLiked: liked }) // campo true/false per non eliminare il documento
      await updateDoc(postRef, {
        popularityScore: increment(liked ? 72 : -72),
      })
    } else {
      await setDoc(likeRef, { // creo il document del like se non esiste
        postId,
        from: userUid,
        to: postAuthorUserName,
        isLiked: true,
        notified: true,
        createdAt: serverTimestamp(),
      })
      await updateDoc(postRef, {
        popularityScore: increment(72), // incremento la popolarità del post
      })
      // creo una notifica per il like (solo la prima volta)
      if (userName != postAuthorUserName) {
        await createNotification({
          from: userName,
          to: postAuthorUserName,
          action: `${postAuthorUserName} liked your post!`,
          postId,
          readed: false,
        })
      }
    }
  } catch (e) {
    console.log(e)
  }
}


export const getLikeCount = async (postId: string): Promise<number> => {
  const q = query(collection(db, 'likes'), where('postId', '==', postId), where('isLiked', '==', true))
  try {
    const res = await getDocs(q)
    return res.size
  } catch (e) {
    console.log(e)
    return 0
  }
}

export const isLikedByUser = async (postId: string, userUid: string): Promise<boolean> => {
  const likeDocRef = doc(db, 'likes', `${postId}_${userUid}`) // chiave composta
  try {
    const likeSnap = await getDoc(likeDocRef)
    if (likeSnap.exists()) {
      const likeData = likeSnap.data() as like
      return likeData.isLiked
    }
    return false
  } catch (e) {
    console.log(e)
    return false
  }
}

export const AddComment = async (post: Post, comment: string, userName: string, uid: string) => {
  try {
    const postRef = doc(db, 'posts', post.id!)
    await updateDoc(postRef, {
      reviews: increment(1),
      popularityScore: increment(120),
    })

    const commentsCollectionRef = collection(db, 'comments')
    await addDoc(commentsCollectionRef, {
      comment,
      userName,
      createdAt: serverTimestamp(),
      post: post.id!,
      uid
    })

    // notifica per eventuali menzioni nel commento
    const mentions = extractMentions(comment)
    for (const mention of mentions) {
      if (mention != userName && mention != post.name) {
        await createNotification({
          from: userName,
          to: mention,
          action: `mentioned you on ${post.title}!`,
          postId: post.id!,
          readed: false,
        })
      }
    }
    if (post.name != userName) {
      await createNotification({
          from: userName,
          to: post.name,
          action: `left a comment on ${post.title}!`,
          postId: post.id!,
          readed: false,
        })
    }
  } catch (e) {
    console.log(e)
  }
}


export const ShowComments = async (post: Post): Promise<PostComment[]> => {
  try {
    const commentsRef = collection(db, 'comments')
    const q = query(commentsRef, (where('post', '==', post.id)))
    const commentsSnap = await getDocs(q)

    return commentsSnap.docs
      .map((doc) => ({
        ...doc.data(),
        id: doc.id,
      } as PostComment))

  } catch (e) {
    return []
  }
}


export const GetPostById = async (postId: string): Promise<Post | null> => {
  const postRef = doc(db, 'posts', postId)
  try {
    const postSnap = await getDoc(postRef)
    if (postSnap.exists()) {
      return {
        ...postSnap.data(),
        id: postSnap.id,
      } as Post
    }
    return null
  } catch (e) {
    console.log(e)
    return null
  }
}


export const getPostsByUserName = async (userName: string): Promise<Post[]> => {
  const postsRef = collection(db, 'posts')
  const q = query(postsRef, where('name', '==', userName), limit(10))
  try {
    const postSnap = await getDocs(q)
    return postSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post))
  } catch (e) {
    console.log(e)
    return []
  }
}

export const getPostsByTopic = async (topicName: string): Promise<Post[]> => {
  const postsRef = collection(db, 'posts')
  const q = query(postsRef, where('topic', '==', topicName))
  try {
    const postSnap = await getDocs(q)
    return postSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Post))
  } catch (e) {
    console.log(e)
    return []
  }
}

export const deletePost = async (postId: string, userUid: string) => {
  try {
    const postRef = doc(db, 'posts', postId)
    const postSnap = await getDoc(postRef)
    if (!postSnap.exists()) {
      throw new Error('')
    }
    if (postSnap.data().uid != userUid) {
      throw new Error('')
    }
    await deleteDoc(postRef)
  } catch (e) {
    throw e
  }
}
