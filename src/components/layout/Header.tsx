import { useNavigate, useLocation } from "react-router-dom"
import { useSidebar } from "../../context/SidebarContext"
import { useAuth } from "../../context/AuthContext"

export default function Header() {
  const { toggle } = useSidebar()
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser, loading } = useAuth()

  const handleClick = () => {
    if (location.pathname == '/') {
      window.location.reload()
    } else {
      navigate('/')
    }
  }

  return (
    <header
      className="fixed top-0 left-0 w-full z-50 bg-black rounded-b-2xl"
    >
      <div className="h-16 flex items-center gap-4 px-4">
        <button className="cursor-pointer"
          onClick={handleClick}>
          <h1 className="font-sans text-3xl text-white font-black tracking-tight">
            yellit
          </h1>
        </button>

        <div className="flex-1" />

        {!loading && currentUser && (
          <button
            onClick={toggle}
            className="ml-2 lg:hidden py-3 px-4 rounded-full text-white"
          >
            <img src="/icons/menu.svg" alt="Back" className="w-4 h-6 invert" />
          </button>
        )}
      </div>
    </header>
  )
}
