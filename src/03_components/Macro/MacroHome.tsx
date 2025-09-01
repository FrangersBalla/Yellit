import { useEffect, useState } from 'react'
import { ShowPostsInMacro, AddLike, RemoveLike } from '../../01_api/Xpost'
import type { Doc } from '../../02_lib/XTypes'

interface MacroHomeProps {
  macroName: string
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  setPost: React.Dispatch<React.SetStateAction<Doc>>
  visible: boolean
  userName: string
}

function MacroHome({macroName, page, setPage, setPost, visible, userName}: MacroHomeProps){
    const [macroPosts, setMacroPosts] = useState<Doc[]>([])
    const [timeOut, setTimeOut] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)


    const liked = (post: Doc): boolean => {
        const inList = post.reactions.find((u: string)=>userName === u)
        return ((inList && post.likes == post.reactions.length) || post.likes == post.reactions.length +1)
    }

    const getPost = async () => {
        const list = await ShowPostsInMacro(macroName)
        setMacroPosts(list.map(p => ({ ...p, likes: p.reactions.length})))
    }

    const reactionHandler = async (post: Doc)=>{
        if (isProcessing) return
        setIsProcessing(true)

        const inList = post.reactions.find((u: string)=>userName === u)
        if ((!inList && post.likes == post.reactions.length) || post.likes == post.reactions.length -1) {
            setMacroPosts(prev => prev.map(p => (p.title == post.title ? { ...p, likes: p.likes + 1 }: p)))
            await AddLike(post, userName)
        }
        else if ((inList && post.likes == post.reactions.length) || post.likes == post.reactions.length +1) {
            setMacroPosts(prev => prev.map(p => (p.title == post.title ? { ...p, likes: p.likes - 1 }: p)))
            await RemoveLike(post, userName)
        }
        setIsProcessing(false)
    }

    useEffect(() => {
        setTimeOut(false)
        const timeoutShow = setTimeout(() => {
            setTimeOut(true)
        }, 600)

        return () => {
        clearTimeout(timeoutShow)
        }
    }, [page, macroName])

    useEffect(() => {
    if (page !== 2) return
        getPost()
    }, [page, macroName])



    return(
    <ul className="space-y-2 text-white">
        {visible && (macroPosts.map((post) => (
        <li key={post.title}>
            <div className="h-auto m-auto bg-black flex flex-col justify-between select-text
                opacity-75 shadow-md rounded-xl w-14/15 mb-10 lg:m-20 lg:w-11/15 p-6">
                <div>
                    <div className="mb-2 flex justify-between items-center">
                        <div className="flex gap-2 flex-wrap font-medium text-base">
                            {/*<div className="text-amber-200 cursor-default px-3 py-1 rounded-2xl">/{post.macroName}/ </div>*/}
                            <div className="text-right text-amber-100/75 whitespace-nowrap cursor-default px-1 py-1 rounded-2xl">{post.name}:</div>
                        </div>
                        <h5 className="text-sm text-right text-amber-200 whitespace-nowrap font-thin">{post.createdAt.toDate().toLocaleString()}</h5>
                    </div>
                    <h1 className='mb-10 text-3xl text-left font-md'>{post.title}</h1>
                    <button onClick={()=>{
                        setPost(post)
                        setPage(4)
                    }}>
                        <p className='mb-5 text-justify line-clamp-8'>{post.content}</p>
                    </button>
                </div>
                <div className='flex gap-2 flex-wrap font-thin text-sm'>
                    <div className='bg-gray-700/25 hover:bg-white/25 px-3 py-1 rounded-2xl'><button onClick={()=>{reactionHandler(post)}} className="flex flex-center"><img src="/icons/like.svg" alt= '' className={`right-0 w-5 ${liked(post)? 'invert': ''} h-5 mr-3`}/> {post.likes} </button></div>
                    <div className='bg-gray-700/25 hover:bg-white/25 px-3 py-1 rounded-2xl'><button onClick={()=>{setPost(post);setPage(4)}}
                        className="text-right whitespace-nowrap">Comments: {post.reviews} </button>
                    </div>
                    <h5 className=""></h5>
                </div>
            </div>
        </li>
        )))}
        {(macroPosts.length == 0 && visible && timeOut) && (<div className='w-14/15 bg-black/25 p-5 text-lg text-center text-white mt-30 rounded-lg transition-all delay-[1s]'><h1>“No posts yet. Be the first to say something!”</h1></div>)}
    </ul>
    )
}

export default MacroHome