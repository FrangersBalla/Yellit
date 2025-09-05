export type Doc = { [key: string]: any; id?: string }

export type Setting = {
  byInvitationOnly: boolean;
  minimumAge: number;
  whoCanSendInvitation: string;
}

export interface User {
  nickName: string
  email: string
  isNew: boolean
  avatarUrl?: string
  uID: string
  country?: string
}