interface SkeletonSidebarProps {
  isSmallScreen: boolean
}

export default function SkeletonSidebar({ isSmallScreen }: SkeletonSidebarProps) {
  return (
    <div className="relative pt-2 rounded-full z-40">
      <aside className={isSmallScreen ?  `fixed inset-0 bg-black text-white z-50 flex flex-col transition-none`
          : `fixed left-0 top-16 mt-2 bg-transparent rounded-xl text-white transition-all duration-300 flex flex-col h-[calc(100vh-4rem)] w-64`
      }>
        {isSmallScreen && (
          <div className="flex items-center justify-end m-1">
            <div className="w-20 h-4 bg-zinc-700 rounded-full animate-pulse"></div>
          </div>
        )}

        <div className="mt-auto p-4">
          <div className="w-full h-16 bg-zinc-700 rounded-2xl animate-pulse"></div>
        </div>
      </aside>

      {isSmallScreen && (
        <div className="fixed inset-0 bg-black/50 z-40"></div>
      )}
    </div>
  )
}