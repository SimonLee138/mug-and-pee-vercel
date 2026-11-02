import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, CalendarDays, ClipboardPlus, Pill } from "lucide-react"

export default function Page() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:gap-10">
        <section className="relative overflow-hidden rounded-3xl border border-border bg-card px-5 py-8 shadow-sm sm:px-10 sm:py-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
          />
          <div className="relative max-w-2xl space-y-5">
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Medication schedules, made simple.
              </h1>
              <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
                Keep cats’ medicines organized and today’s doses easy to
                check off, all in one place.
              </p>
            </div>
            <div className="flex flex-col gap-3 pt-1 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/medications">
                  <CalendarDays aria-hidden="true" />
                  View medication schedule
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href="/medications/create">
                  <ClipboardPlus aria-hidden="true" />
                  Add a medication
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section aria-label="Quick links" className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/medicines"
            className="group flex min-h-32 items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-primary/40 hover:shadow-md sm:p-6"
          >
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Pill aria-hidden="true" />
              </span>
              <span>
                <span className="block font-semibold text-foreground">Medicine cabinet</span>
                <span className="mt-1 block text-sm text-muted-foreground">Review the medicine list and contents</span>
              </span>
            </div>
            <ArrowRight aria-hidden="true" className="h-5 w-5 shrink-0 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
          </Link>
          <Link
            href="/cats"
            className="group flex min-h-32 items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-primary/40 hover:shadow-md sm:p-6"
          >
            <span>
              <span className="block font-semibold text-foreground">My cats</span>
              <span className="mt-1 block text-sm text-muted-foreground">A little page for my cats behind the schedule</span>
            </span>
            <ArrowRight aria-hidden="true" className="h-5 w-5 shrink-0 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
          </Link>
        </section>
      </div>
    </main>
  )
}
