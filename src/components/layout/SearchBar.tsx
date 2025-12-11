import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from 'react-i18next'

type Props = {
  onClose?: ()=>void
}

export default function SearchBar({onClose}:Props) {
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleSearch = () => {
    const q = searchQuery.trim()
    if (q.length) {
      onClose?.() //solo da menu
      navigate(`/search?q=${encodeURIComponent(q)}`)
    }
  }

  return (
    <div className="flex items-center bg-zinc-800 rounded-full px-3 py-2">
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            handleSearch()
          }
        }}
        placeholder={t('search')}
        aria-label="Search"
        className="flex-1 bg-transparent text-white focus:outline-none select-text"
      />
      <button
        onClick={handleSearch}
        className="ml-2 p-1 hover:opacity-75"
        aria-label="Search button"
      >
        <img src="/icons/search.svg" alt="Search" className="w-4 h-4 invert" />
      </button>
    </div>
  )
}