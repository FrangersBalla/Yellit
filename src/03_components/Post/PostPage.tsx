import type {Doc} from '../../02_lib/XTypes'
import { AddComment, AddLike, RemoveLike, ShowComments } from '../../01_api/Xpost'
import { useEffect, useState } from 'react'

interface PostPageProps {
    post: Doc
    setPage: React.Dispatch<React.SetStateAction<number>>
    oldPage: number
    userName: string
    page: Number
}
    
function PostPage({post, setPage, oldPage, userName, page}:PostPageProps) {
    const Liked = (post: Doc) => (post.likes == post.reactions.length+1 || post.reactions.find((u: string)=>userName === u))
    const [liked, setLiked] = useState(Liked(post))
    const [likes, setLikes] = useState<number>(post.likes)
    const [commentsList, setCommentsList] = useState<Doc[]>([])
    const [comment, setComment] = useState('')
    const [submit, setSubmit] = useState(true)
    const [isProcessing, setIsProcessing] = useState(false)

    const reactionHandler = async ()=>{
        if (isProcessing) return
        setIsProcessing(true)

        if (!liked) {
            await AddLike(post, userName)
            setLikes(prev => prev+1)
            setLiked(true)
        }
        else {
            await RemoveLike(post, userName)
            setLikes(prev => prev -1)
            setLiked(false)
        }
        setIsProcessing(false)
    }

    const commentSubmit = async () => {
        if (!comment.trim()) return
        await AddComment(post, comment, userName)
        setSubmit(true)
    }

    useEffect(() =>{
        if(page == 4 && submit) {
            const fetchComments = async () => {
                const comments = await ShowComments(post)
                setCommentsList([...comments])
            }
            fetchComments()
            setComment('')
            setSubmit(false)
        }
    },[page, submit])

    return(
        <div className="space-y-2 text-white h-auto m-auto bg-black flex flex-col justify-between select-text
            opacity-75 shadow-md rounded-xl w-14/15 mb-10 lg:m-20 lg:w-11/15 p-6">
            <div>
                <div className="mb-2 items-center">
                    <div className="flex gap-2 flex-wrap font-medium text-base">
                        <button onClick={()=>{setPage(oldPage)
                            
                        }} className=""><img src="/icons/back.svg" alt= '' className="right-0 w-6 h-6 invert opacity-50"/></button>
                        <div className="text-right cursor-default whitespace-nowrap text-amber-200 px-3 py-1 rounded-2xl">/{post.macroName}/ </div>
                        <div className="text-right cursor-default whitespace-nowrap text-amber-100/75 py-1 rounded-2xl">{post.name}:</div>
                    </div>
                    <h5 className="text-sm text-right text-amber-200 whitespace-nowrap font-thin">{post.createdAt.toDate().toLocaleString()}</h5>
                </div>
                <h1 className='mb-10 text-3xl text-left font-md'>{post.title}</h1>
                <div><p className='mb-5 text-left hyphens-auto line-clamp-none'>{post.content}</p></div>
            </div>
            <div className='flex gap-2 flex-row font-thin text-sm mb-10 '>
                <div className='bg-gray-700/25 hover:bg-white/25 px-3 py-1 rounded-2xl'><button onClick={reactionHandler} className="flex flex-center"><img src="/icons/like.svg" alt= '' className={`right-0 w-5 ${liked? 'invert': ''} h-5 mr-3`}/> {likes} </button></div>
                <h5 className=""></h5>
            </div>

            <div className="mt-10 pt-5 space-y-4 border-t border-white/25">
                <h2 className="text-lg font-semibold text-white">Comments</h2>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2 mb-20">
                    {commentsList.map((comm, i) => (
                        <div key={i} className="bg-zinc-800 p-3 rounded-lg">
                            <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-medium text-amber-200">{comm.userName}</span>
                            <span className="text-xs text-gray-400">{comm.createdAt!.toDate()!.toLocaleDateString('it-IT', {day: '2-digit', month: '2-digit', year: '2-digit'})}</span>
                            </div>
                            <p className="text-sm text-white break-words inline">{comm.comment}</p>
                        </div>
                    ))}
                </div>
                <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-2">
                    <textarea
                        placeholder="Write a comment..."
                        className="w-full p-2 rounded text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-300"
                        rows={3}
                        onChange={(e) => setComment(e.target.value)}
                        value={comment}
                    />
                    <button
                        type="submit"
                        onClick={commentSubmit}
                        className="self-end bg-amber-200 text-black font-medium px-4 py-1 rounded hover:bg-amber-300 transition"
                    >
                    Send
                    </button>
                </form>
            </div>
        </div>
    )
}

export default PostPage