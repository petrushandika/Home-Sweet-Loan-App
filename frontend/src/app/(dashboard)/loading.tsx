import { Skeleton } from "@/components/ui/skeleton"
import { BrandLoader } from "@/components/brand-loader"

export default function DashboardLoading() {
  return (
    <>
      <BrandLoader />
      <div className="space-y-10 pb-10 w-full animate-smooth-in">
        {/* Header Skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-3">
            <Skeleton className="h-10 w-64 rounded-xl" />
            <Skeleton className="h-4 w-48 rounded-lg" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-11 w-32 rounded-full" />
            <Skeleton className="h-11 w-40 rounded-full" />
          </div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 rounded-3xl border border-slate-100 bg-white p-6 space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <Skeleton className="h-5 w-12 rounded-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-6 w-32 text-2xl" />
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid Skeleton */}
        <div className="grid gap-8 grid-cols-1 xl:grid-cols-12">
          <div className="xl:col-span-8">
            <div className="rounded-3xl border border-slate-100 bg-white p-6 md:p-10 space-y-10">
                <div className="space-y-2">
                  <Skeleton className="h-8 w-40" />
                  <Skeleton className="h-4 w-60" />
                </div>
                <Skeleton className="h-[350px] w-full rounded-2xl" />
            </div>
          </div>

          <div className="xl:col-span-4">
            <div className="rounded-3xl border border-slate-100 bg-white p-6 md:p-10 space-y-8 h-full">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
                <div className="space-y-6">
                  {[1, 2, 3, 4, 5].map((idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-2xl shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-2/3" />
                      </div>
                      <Skeleton className="h-5 w-16" />
                    </div>
                  ))}
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
