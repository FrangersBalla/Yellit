import Header from "../components/layout/Header"
import { Outlet } from "react-router-dom"
import Sidebar from "../components/layout/SideBar"
import { SidebarProvider } from "../context/SidebarContext"
import { useAuth } from "../context/AuthContext"

function MainLayout() {
  const { loading } = useAuth() //non mostro la sidebar finche non ho caricato lo stato utente

  return (
    <SidebarProvider>
      <Header />
      {!loading ? <Sidebar /> : null}
      <main className="pt-16 lg:pl-64">
        <Outlet />
      </main>
    </SidebarProvider>
  )
}

export default MainLayout
