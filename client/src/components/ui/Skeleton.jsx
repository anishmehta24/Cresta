export function Skeleton({ className='' }) {
  return <div className={`animate-pulse rounded bg-gray-200/60 dark:bg-gray-700/40 ${className}`}></div>
}

export function SkeletonText({ lines=3, className='' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({length: lines}).map((_,i)=>(
        <div key={i} className="h-3 w-full rounded bg-gray-200/60 animate-pulse" style={{width: `${90 - i*10}%`}} />
      ))}
    </div>
  )
}
