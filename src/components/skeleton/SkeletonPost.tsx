export default function SkeletonPost() {
  return (
    <div className="h-auto m-auto bg-gradient-to-br from-black/80 to-black/60 shadow-lg rounded-xl w-14/15 mb-10 mt-10 lg:mb-20 lg:w-11/15 p-6 border border-zinc-800/50">

      <div className="flex justify-between items-center mb-4 gap-4">
        <div className="flex gap-2">
          <div className="h-6 bg-gradient-to-r from-zinc-700 to-zinc-800 rounded-full w-20 animate-pulse" />
          <div className="h-6 bg-gradient-to-r from-zinc-700 to-zinc-800 rounded-full w-24 animate-pulse" />
        </div>
        <div className="h-4 bg-gradient-to-r from-zinc-700 to-zinc-800 rounded w-32 animate-pulse" />
      </div>

      <div className="mb-6">
        <div className="h-8 bg-gradient-to-r from-zinc-700 via-zinc-600 to-zinc-700 rounded w-4/5 animate-pulse" />
      </div>

      <div className="space-y-2 mb-6">
        <div className="h-3 bg-gradient-to-r from-zinc-700 to-zinc-800 rounded w-full animate-pulse" />
        <div className="h-3 bg-gradient-to-r from-zinc-700 to-zinc-800 rounded w-5/6 animate-pulse" />
      </div>

      <div className="flex gap-2 flex-wrap">
        <div className="h-8 w-24 bg-gradient-to-r from-zinc-700 to-zinc-800 rounded-full animate-pulse" />
        <div className="h-8 w-28 bg-gradient-to-r from-zinc-700 to-zinc-800 rounded-full animate-pulse" />
      </div>
    </div>
  )
}
