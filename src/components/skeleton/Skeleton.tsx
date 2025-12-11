import SkeletonPost from './SkeletonPost'

export function Skeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-zinc-900/80 p-6 rounded-3xl shadow-lg max-w-4xl mx-auto mb-8">
        <div className="flex justify-between items-start">
          <div className="flex items-start gap-2">
            <div className="bg-gray-700 h-6 w-6 rounded"></div>
            <div className="flex-1">
              <div className="bg-gray-700 h-6 w-24 mb-2 rounded"></div>
              <div className="bg-gray-700 h-4 w-32 rounded"></div>
            </div>
          </div>
          <div className="bg-gray-700 h-8 w-24 rounded-full"></div>
        </div>
      </div>

      <div className="space-y-4 max-w-3xl mx-auto">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonPost key={i} />
        ))}
      </div>
    </div>
  )
}