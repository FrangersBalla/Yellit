export type like = {
  createdAt: any 
  postId: string //post su cui è stato messo like
  from: string //uid dell'utente che ha messo like
  to: string //userName di chi ha creato il post
  isLiked: boolean //se il like viene tolto va a false
}