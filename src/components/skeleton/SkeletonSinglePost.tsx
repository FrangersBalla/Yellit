export default function SkeletonSinglePost() {
  return (
    <div className="space-y-2 text-white h-auto m-auto bg-black flex flex-col justify-between select-text shadow-md rounded-xl w-14/15 mb-10 p-6 pb-48">
      <div className="space-y-6">

        <div className="h-4 bg-zinc-700 rounded w-24 animate-pulse" />

        <div className="space-y-4">
          <div className="h-6 bg-zinc-700 rounded w-3/4 animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 bg-zinc-700 rounded w-full animate-pulse" />
            <div className="h-4 bg-zinc-700 rounded w-full animate-pulse" />
            <div className="h-4 bg-zinc-700 rounded w-2/3 animate-pulse" />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="h-8 w-16 bg-zinc-700 rounded-full animate-pulse" />
          <div className="h-4 bg-zinc-700 rounded w-12 animate-pulse" />
        </div>

        <div className="space-y-4">
          <div className="h-5 bg-zinc-700 rounded w-20 animate-pulse" />
          <div className="space-y-3">
            <div className="bg-zinc-800 p-3 rounded-lg space-y-2">
              <div className="flex items-center space-x-2">
                <div className="h-6 w-6 bg-zinc-700 rounded-full animate-pulse" />
                <div className="h-4 bg-zinc-700 rounded w-24 animate-pulse" />
              </div>
              <div className="h-3 bg-zinc-700 rounded w-full animate-pulse" />
            </div>
            <div className="bg-zinc-800 p-3 rounded-lg space-y-2">
              <div className="flex items-center space-x-2">
                <div className="h-6 w-6 bg-zinc-700 rounded-full animate-pulse" />
                <div className="h-4 bg-zinc-700 rounded w-24 animate-pulse" />
              </div>
              <div className="h-3 bg-zinc-700 rounded w-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
