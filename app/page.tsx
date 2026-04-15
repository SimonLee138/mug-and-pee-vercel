import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Page() {
  return (
    <div className="flex min-h-screen bg-background p-6">
      <div className="mx-auto flex max-w-6xl min-w-0 flex-col gap-4 text-sm leading-loose">
        <div className="mx-auto flex flex-col justify-center gap-2">
          <div className="flex space-y-4 rounded-3xl border border-border bg-card/90 p-6 shadow-sm">
            <div className="space-y-2">
              <p className="text-sm font-medium tracking-[0.3em] text-muted-foreground uppercase">
                Home
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                My cat's medication schedule
              </h1>
            </div>
          </div>
          <Image
            src="/muggle.JPEG"
            alt="A cute cat"
            width={400}
            height={400}
            className="rounded-3xl border border-border bg-card/90 p-6 shadow-sm"
          />
          <Image
            src="/peeves.JPEG"
            alt="A cute cat"
            width={400}
            height={400}
            className="rounded-3xl border border-border bg-card/90 p-6 shadow-sm"
          />
        </div>
      </div>
    </div>
  )
}
