import { useEffect, useState} from "react"
import type { ChangeEvent, KeyboardEvent } from "react"
import { PopolareMacros } from "../01_api/Xmacro"

interface SearchBarProps {
  onSearch: (query: string) => void
}


export default function SearchBar({ onSearch }: SearchBarProps) {
  const [search, setSearch] = useState<string>("")
  const [filtered, setFiltered] = useState<string[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)
  const [dataFromDb, setDataFromDb] = useState<boolean>(false)
  const [isNotLoaded, setIsNotLoaded] = useState<boolean>(true)
  const [suggestionsData, setSuggestionsData] = useState<string[]>([])

  const getSuggestionsData = async () => {
    const data = await PopolareMacros()
    setSuggestionsData(data)
  }

  useEffect(()=>{
    if(isNotLoaded){
      getSuggestionsData()
      setIsNotLoaded(false)
    }
  },[dataFromDb])

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    setSelectedIndex(-1)

    if (value === "") {
      setFiltered([]);
    } else {
      if(value.length == 1) setDataFromDb(prev=>!prev)
      const results = suggestionsData.filter((item) =>
      item.toLowerCase().includes(value.toLowerCase())
    )
    setFiltered(results)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (filtered.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % filtered.length)
      }
      if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) =>
          prev <= 0 ? filtered.length - 1 : prev - 1
        )
      }
      if (e.key === "ArrowRight") {
        if (selectedIndex >= 0) {
          setSearch(filtered[selectedIndex])
          setFiltered([])
          setSelectedIndex(-1)
        }
      }
    }

    if (e.key === "Enter") {
      const selectedValue = selectedIndex >= 0 ? filtered[selectedIndex] : search
      onSearch(selectedValue)
      setSearch("")
      setFiltered([])
      setSelectedIndex(-1)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setSearch(suggestion)
    setFiltered([])
    setSelectedIndex(-1)
  }

  return (
    <div className="relative flex-1 flex gap-2 bg-zinc-900 mx-10 lg:mx-80 md:32 sm:mx-10 xs:mx-0 rounded-xl">
      <input
        type="text"
        value={search}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Search..."
        className="w-full px-4 py-2 rounded-xl non-italic text-white focus:outline-none"
      />
      
      {filtered.length > 0 && (
        <ul className="absolute top-full left-0 w-full bg-zinc-900/99 text-white shadow-md rounded mt-1 z-50">
          {filtered.map((item, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(item)}
              className={`px-4 py-2 cursor-pointer ${
                index === selectedIndex ? "bg-amber-200 text-black" : "hover:bg-amber-200 hover:text-black"
              }`}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
