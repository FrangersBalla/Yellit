import { useState } from "react"
import type { KeyboardEvent } from "react"
import { auth } from "../../00_config/firebase";
import { CreateNewPost } from '../../01_api/Xpost'

type NewMacroProps = {
  setSucc: React.Dispatch<React.SetStateAction<boolean>>
  setPage: React.Dispatch<React.SetStateAction<number>>
  macroName: string
  name: string
}

function CreatePost({ setSucc, setPage, macroName, name }: (NewMacroProps)){
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault()
            e.stopPropagation() 
        }
    }
    const handleCreatePost = async () => {
        let errCode: number = 4
        if((auth && auth.currentUser && auth.currentUser.uid)){
            errCode = await CreateNewPost(macroName, name, title, content)
        }
        setSucc(errCode < 1)
        handleClose()
    }

    const handleClose = ()=>{
        setPage(2)
    }

    return (
    <div className="flex items-center justify-center h-full mt-30 lg:mr-40">
      <form 
        onSubmit={(e) => {
            e.preventDefault()
            handleCreatePost()
        }}
        className="bg-black opacity-100 shadow-md rounded px-8 pt-6 pb-8 w-full max-w-xl">
        <div className="relative flex items-center justify-center mb-6 h-10">
            <button onClick={handleClose} className="absolute left-0 cursor-pointer">
                <img src="/icons/close.svg" alt="" className="w-6 h-6 invert" />
            </button>
            <h2 className="text-2xl text-white font-bold">Create Post</h2>
        </div>

        <div className="mb-4">
            <label className="block text-white text-md font-bold mb-2" htmlFor="title">
                Title 📚
            </label>
            <input
                onKeyDown={handleKeyDown}
                required placeholder="Choose a title..."
                onChange={(e) => {setTitle(e.target.value)}}
                className="shadow appearance-none border-none rounded w-full py-2 pr-3 text-gray-500 focus:not-placeholder-shown:text-white leading-tight focus:outline-none focus:shadow-outline"
            />
        </div>

        <div className="mb-6">
            <label className="block text-white font-bold mb-2" htmlFor="content">
            Insight 💭
            </label>
            <textarea
            id="content"
            required placeholder="Say it like you mean it!!"
            onChange={(e) => {setContent(e.target.value)}}
            className="shadow appearance-none border-none hover:!border-gray-400  rounded w-full py-2 pr-3 text-gray-500 focus:not-placeholder-shown:text-white leading-tight focus:outline-none focus:shadow-outline"
            rows={6}
            ></textarea>
        </div>

      <div className="flex items-center justify-between">
        <button type='submit' className="mt-20 w-full bg-amber-200 py-2 mb-4 rounded-lg text-black transition">
            Publish!
        </button>
      </div>
    </form>
  </div>   
    )
}

export default CreatePost