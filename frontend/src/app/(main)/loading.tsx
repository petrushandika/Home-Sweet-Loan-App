import { Skeleton } from "@/components/ui/skeleton"
import { BrandLoader } from "@/components/brand-loader"

export default function Loading() {
  return (
    <>
      <BrandLoader />
      <div className="flex flex-col w-full animate-smooth-in noise">
        <section className="py-16 md:py-24 px-6 border-b border-slate-50 relative overflow-hidden bg-white">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <Skeleton className="h-6 w-32 mx-auto rounded-full" />
            <Skeleton className="h-16 md:h-24 w-full mx-auto rounded-2xl" />
            <Skeleton className="h-4 w-2/3 mx-auto rounded-lg" />
          </div>
        </section>

        <section className="py-20 px-6 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-10 rounded-[3rem] border border-slate-100 bg-white space-y-8">
                <Skeleton className="h-16 w-16 rounded-3xl" />
                <div className="space-y-4">
                  <Skeleton className="h-10 w-3/4 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </section>

        <section className="py-20 bg-emerald-50/30">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <Skeleton className="h-12 w-full rounded-2xl" />
              <Skeleton className="h-32 w-full rounded-2xl" />
              <Skeleton className="h-14 w-40 rounded-full" />
            </div>
            <Skeleton className="aspect-video w-full rounded-[2.5rem]" />
          </div>
        </section>
      </div>
    </>
  )
}
