import { LogOut } from '../../01_api/Xauth'
import type { User } from '../../02_lib/XTypes'

interface UserCardProps {
  CurrentUser: User
  onLoginChange: (loggedIn: boolean) => void
  setPage: React.Dispatch<React.SetStateAction<number>>
  setOldPage: React.Dispatch<React.SetStateAction<number>>
}

export default function UserCard({CurrentUser, onLoginChange, setPage, setOldPage }: UserCardProps) {
  const handleLogOut = async ()=>{
    setPage(0)
    setOldPage(0)
    onLoginChange(false)
    await LogOut()
  }
  return (
    <div className="bg-black p-4 z-50 rounded-xl flex items-center relative">
      <div>
        <h2 className="text-lg font-medium text-amber-100/80">{CurrentUser.nickName}</h2>
        <p className="text-sm text-gray-500">{CurrentUser.email}</p>
      </div>
      <div className="flex justify-end items-center w-full h-16 px-4">
        <button onClick={handleLogOut}><img src="/icons/exit.svg" alt= '' className="right-0 w-6 h-6 invert opacity-50"/></button>
      </div>
    </div>
  );
}
