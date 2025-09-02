import { useEffect, useState } from 'react'
import { GlobalFeed, AddLike, RemoveLike } from '../../01_api/Xpost'
import type { Doc } from '../../02_lib/XTypes'
import { GetMacroInfo } from "../../01_api/Xmacro"

interface HomeProps {
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  setPost: React.Dispatch<React.SetStateAction<Doc>>
  setShowMacro: React.Dispatch<React.SetStateAction<boolean>>
  setMacroInfo: React.Dispatch<React.SetStateAction<Doc[]>>
  userName: string
}

function Home({ page, setPage, setPost, setShowMacro, setMacroInfo, userName}: HomeProps){
  const [feed, setFeed] = useState<Doc[]>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const liked = (post: Doc): boolean => {
    const inList = post.reactions.find((u: string) => userName === u)
    return ((inList && post.likes === post.reactions.length) || post.likes === post.reactions.length + 1)
  }

  const getPost = async () => {
    const list = await GlobalFeed()
    setFeed(list.map(p => ({ ...p, likes: p.reactions.length })))
  }

  const getMacro = async (macroName: string) => {
    const info = await GetMacroInfo(macroName)
    setMacroInfo(info)
    if(info.length > 0) setShowMacro(true)
  }

  const reactionHandler = async (post: Doc) => {
    if (isProcessing) return
    setIsProcessing(true)

    const inList = post.reactions.find((u: string) => userName === u)

    if ((!inList && post.likes === post.reactions.length) || post.likes === post.reactions.length - 1) {
      setFeed(prevFeed => prevFeed.map(p => p.title === post.title ? { ...p, likes: p.likes + 1 } : p))
      try {
        await AddLike(post, userName)
      } catch (error) {
      }
    } else if ((inList && post.likes === post.reactions.length) || post.likes === post.reactions.length + 1) {
      setFeed(prevFeed => prevFeed.map(p => p.title === post.title ? { ...p, likes: p.likes - 1 } : p))
      try {
        await RemoveLike(post, userName)
      } catch (error) {
      }
    }

    setIsProcessing(false)
  }

  useEffect(() => {
    if (page !== 0) return
    getPost()
  }, [page])

  useEffect(() => {
    if (page !== 0) return
    if (feed.length === 0) return

    const savedScroll = sessionStorage.getItem('homeScroll')
    if (savedScroll) {
      window.scrollTo(0, parseInt(savedScroll))
    }
  }, [feed, page])

  useEffect(() => {
    if (page !== 0) return

    const onScroll = () => {
      sessionStorage.setItem('homeScroll', window.scrollY.toString())
    }

    window.addEventListener('scroll', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [page])

  return(
    <ul className="space-y-2 text-white h-[100vh]">
      {feed.map((post) => (
        <li key={post.title} className="last:pb-20">
          <div className="h-auto m-auto bg-black flex flex-col justify-between select-text 
            opacity-75 shadow-md rounded-xl w-14/15 mb-10 lg:m-20 lg:w-11/15 p-6">
            <div>
              <div className="mb-2 flex justify-between items-center">
                <div className="flex gap-2 flex-wrap font-medium text-base">
                  <button className="text-amber-200 hover:bg-gray-700/25 px-3 py-1 rounded-2xl"
                    onClick={() => { getMacro(post.macroName) }}
                  >
                    /{post.macroName}/
                  </button>
                  <div className="text-right text-amber-100/75 whitespace-nowrap cursor-default py-1 rounded-2xl">{post.name}:</div>
                </div>
                <h5 className="text-sm text-right text-amber-200 whitespace-nowrap font-thin">
                  {post.createdAt.toDate().toLocaleString()}
                </h5>
              </div>
              <h1 className='mb-10 text-3xl text-left font-md'>{post.title}</h1>
              <button onClick={() => {
                setPost(post)
                setPage(4)
              }}>
                <p className='mb-5 text-left line-clamp-8'>{post.content}</p>
              </button>
            </div>
            <div className='flex gap-2 flex-wrap font-thin text-sm'>
              <div className='bg-gray-700/25 hover:bg-white/25 px-3 py-1 rounded-2xl'>
                <button onClick={() => { reactionHandler(post) }} className="flex flex-center">
                  <img src="/icons/like.svg" alt='' className={`right-0 w-5 ${liked(post) ? 'invert' : ''} h-5 mr-3`} />
                  {post.likes}
                </button>
              </div>
              <div className='bg-gray-700/25 hover:bg-white/25 px-3 py-1 rounded-2xl'>
                <button onClick={() => { setPost(post); setPage(4) }} className="text-right whitespace-nowrap">
                  Comments: {post.reviews}
                </button>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default Home
