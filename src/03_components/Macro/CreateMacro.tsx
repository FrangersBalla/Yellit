import { useState } from "react"
import { auth } from "../../00_config/firebase"
import { CreateNewMacro, loadTopics } from '../../01_api/Xmacro'
import type { KeyboardEvent, ChangeEvent } from "react"
import type { User } from "../../02_lib/XTypes"

type NewMacroProps = {
  setSucc: React.Dispatch<React.SetStateAction<boolean>>
  setPage: React.Dispatch<React.SetStateAction<number>>
  user: User | null
  setOldPage: React.Dispatch<React.SetStateAction<number>>
  setMacroname: React.Dispatch<React.SetStateAction<string>>
  setOpenIndex: React.Dispatch<React.SetStateAction<string | null>>
}

function NewMacro({ setSucc, setPage, user, setMacroname, setOpenIndex }: NewMacroProps) {

  const [newMacroName, setNewMacroName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedTopics, setSelectedTopics] = useState<string[]>([])
  const [_xErr, setXErr] = useState(3)
  const [topics, setTopics] = useState<string[]>([])
  const [hasLoaded, setHasLoaded] = useState(false)

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement> | KeyboardEvent<HTMLSelectElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  const load = async () => {
    if (!hasLoaded) {
      const topicsArray = await loadTopics()
      setHasLoaded(true)
      setTopics(topicsArray)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, opt => opt.value)

    if (selectedTopics.length < 3) {
      setSelectedTopics(prev => [...new Set<string>([...prev, ...selectedOptions])])
    } else {
      alert('You can select up to 3 topics only')
    }
  }

  const onSubmitMacro = async () => {
    let errCode = 4
    if (auth && auth.currentUser && auth.currentUser.uid) {
      errCode = await CreateNewMacro(
        newMacroName,
        1,
        auth.currentUser.uid,
        user!.nickName,
        description,
        selectedTopics.join(', '),
        user!.country
      )
    }
    setXErr(errCode)
    setSucc(errCode < 1)
    setOpenIndex(newMacroName)
    setMacroname(newMacroName)
    setPage(2)
  }

  const handleClose = () => {
    setPage(0)
  }

  return (
    <div className="flex items-center rounded-xl justify-center items-center mb-20 mt-16 md:mt-20 md:px-20 lg:mr-40">
      <form className="bg-black opacity-100 rounded-xl px-4 pt-6 pb-8 w-full max-w-md">
        <div className="relative flex items-center justify-center mb-5 h-10">
          <button
            type="button"
            onClick={handleClose}
            className="absolute left-0 cursor-pointer"
            aria-label="Close form"
          >
            <img src="/icons/close.svg" alt="Close" className="w-6 h-6 invert" />
          </button>
          <h2 className="text-2xl text-white font-bold">Create Channel</h2>
        </div>

        <div className="mb-2">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            onKeyDown={handleKeyDown}
            required
            placeholder="Name your channel..."
            onChange={(e) => setNewMacroName(e.target.value)}
            value={newMacroName}
            className="shadow appearance-none border-none rounded w-full py-2 pr-3 text-gray-500 focus:not-placeholder-shown:text-white leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-1">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            required
            placeholder="Write a Description..."
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            className="shadow appearance-none border-none rounded w-full py-2 pr-3 text-gray-500 focus:not-placeholder-shown:text-white leading-tight focus:outline-none focus:shadow-outline"
            rows={3}
          />
        </div>

        {false &&<div className="mb-1">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="topic">
            Topic
          </label>
          <select
            id="topic"
            multiple
            value={selectedTopics}
            onKeyDown={handleKeyDown}
            onChange={handleChange}
            onFocus={load}
            className="rounded p-2 w-full"
          >
            {!hasLoaded ? (
              <option>Loading...</option>
            ) : (
              <>
                <option value="">Select up to 3 topics</option>
                {topics.map(topic => (
                  <option
                  className='text-white'
                  key={topic}
                  value={topic}
                  disabled={selectedTopics.length >= 3 && !selectedTopics.includes(topic)}
                  >
                    {topic}
                  </option>
                ))}
              </>
            )}
          </select>
          <p className="text-sm text-white mt-2">Selected: {selectedTopics.join(', ') || 'None'}</p>
        </div>}

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onSubmitMacro}
            className="mt-10 w-full bg-amber-200 p-2 mb-4 rounded-lg text-black transition"
          >
            Create new channel
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewMacro
