import { Timestamp } from 'firebase/firestore'

export const formatDate = (createdAt: Timestamp): string => {
  try {
    // Timestamp di firebase
    const date = createdAt.toDate()

    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch (e) {
    console.log(e)
    return 'N/A'
  }
}
