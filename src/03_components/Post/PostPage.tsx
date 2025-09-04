import type {Doc} from '../../02_lib/XTypes'
import { AddComment, AddLike, RemoveLike, ShowComments } from '../../01_api/Xpost'
import { useEffect, useState } from 'react'
import LingvaTranslateWithDetect from '../../01_api/Xtranslate'

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
    const [translation, setTranslation] = useState('')
    const [loading, setLoading] = useState(false)
    const [translated, setTranslated] = useState(false)

    const handleTranslate = async () => {
        if (!translated) {
            if (!post.content.trim()) return
            setLoading(true)
            const result = await LingvaTranslateWithDetect(post.content)
            setTranslation(result)
            setLoading(false)
            setTranslated(true)
        } else setTranslated(false)
    }

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
        <div className="h-full w-full flex flex-col overflow-y-auto items-center justify-center rounded-xl bg-black w-14/15 md:m-20 lg:w-11/15 p-6">
            <div className="space-y-3 max-h-[calc(100vh-15rem)] overflow-y-auto text-white shadow-md">
                <div className="sticky top-0 z-10 bg-black p-4">
                    <div className="flex gap-2 flex-wrap items-center font-medium text-base mb-2">
                        <button onClick={() => setPage(oldPage)} className="">
                            <img src="/icons/back.svg" alt='' className="w-6 h-6 invert opacity-50" />
                        </button>
                        <div className="text-amber-200 px-3 py-1 rounded-2xl">/{post.macroName}/</div>
                        <div className="text-amber-100/75 py-1 rounded-2xl">{post.name}:</div>
                    </div>
                    <h5 className="text-sm text-amber-200 font-thin">{post.createdAt.toDate().toLocaleString()}</h5>
                    <h1 className="text-3xl mt-4">{post.title}</h1>
                </div>
                <div><p className='mb-5 mt-5 text-left hyphens-auto line-clamp-none'>{translated ? translation : post.content}</p></div>
                <div className='flex gap-2 flex-row font-thin text-sm mb-10 '>
                    <div className='bg-gray-700/25 hover:bg-white/25 px-3 py-1 rounded-2xl'>
                        <button onClick={reactionHandler} className="flex flex-center">
                        <img src="/icons/like.svg" alt='' className={`right-0 w-5 ${liked ? 'invert' : ''} h-5 mr-3`} /> {likes}
                        </button>
                    </div>

                    <div className='bg-gray-700/25 hover:bg-white/25 px-3 py-1 rounded-2xl'>
                        <button onClick={handleTranslate} className="flex flex-center">
                        {translated? 'See Original ': loading ? 'Translating...' : 'Translate '}
                        </button>
                    </div>
                </div>


                <div className="mt-10 pt-5 space-y-4 border-t border-white/25">
                    <h2 className="text-lg font-semibold text-white">Comments</h2>
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-2 mb-20">
                        {commentsList.sort((a, b) => b.createdAt!.toDate()! - a.createdAt!.toDate()!).map((comm, i) => (
                            <div key={i} className="bg-zinc-800 p-3 rounded-lg">
                                <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium text-amber-200">{comm.userName}</span>
                                <span className="text-xs text-gray-400">{comm.createdAt!.toDate()!.toLocaleDateString('it-IT', {day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit'})}</span>
                                </div>
                                <p className="text-sm text-white break-words inline">{comm.comment}</p>
                            </div>
                        ))}
                    </div>
                    
                </div>
            </div>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-row w-full mt-4 gap-2">
                <textarea
                    placeholder="Write a comment..."
                    className="w-full p-2 rounded text-white text-sm resize-none focus:outline-none "
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
    )
}

export default PostPage