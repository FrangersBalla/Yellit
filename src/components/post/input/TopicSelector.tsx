import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { searchTopics } from '../../../services/topicServices'

interface TopicSelectorProps {
  selectedTopic: string | null
  setSelectedTopic: (topic: string | null) => void
}

export const TopicSelector = ({ selectedTopic, setSelectedTopic }: TopicSelectorProps) => {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const { t } = useTranslation()

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (selectedTopic?.trim()) {
        const res = await searchTopics(selectedTopic)
        setSuggestions(res)
      } else {
        setSuggestions([])
      }
    }

    const tm = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(tm)
  }, [selectedTopic])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSelectedTopic(value || null)
  }

  const handleClear = () => {
    setSelectedTopic(null)
    setSuggestions([])
  }

  return (
    <div className="w-full max-w-4xl mt-4">
      <div className="relative">
        <input
          type="text"
          value={selectedTopic || ''}
          onChange={handleChange}
          placeholder={t('addTopic')}
          className="w-full px-4 py-2 bg-black rounded-3xl text-white placeholder:text-gray-400 focus:outline-none"
        />
        {selectedTopic && (
          <button
            onClick={handleClear}
            className="absolute right-2 px-1 top-1/2 transform -translate-y-1/2"
          >
            <img src="/icons/close.svg" alt="Close" className="w-4 h-4 invert" />
          </button>
        )}
        {suggestions.length > 0 && (
          <div className="absolute top-full mt-1 w-full bg-zinc-800 border-none rounded-3xl z-10 max-h-40 overflow-y-auto">
            {suggestions.map((topic, index) => (
              <button
                key={index}
                onClick={() => setSelectedTopic(topic)}
                className="w-full text-left px-4 py-2"
              >
                {topic}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}