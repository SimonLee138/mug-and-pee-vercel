"use client"

import {
  Calendar as CalendarIcon,
  Plus,
} from "lucide-react"
import Link from "next/link"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "../ui/button"
import { format, parseISO } from "date-fns"
import { useRouter } from "next/navigation"

export default function MedicationCard({
  selectedDate,
}: {
  selectedDate: string
}) {
  const router = useRouter()
  const [date, setDate] = React.useState<Date | undefined>(parseISO(selectedDate))
  const [mobileDateOpen, setMobileDateOpen] = React.useState(false)
  const [desktopDateOpen, setDesktopDateOpen] = React.useState(false)

  React.useEffect(() => {
    setDate(parseISO(selectedDate))
  }, [selectedDate])

  const changeDate = (nextDate: Date | undefined) => {
    if (!nextDate) return

    setDate(nextDate)
    router.push(`/medications?date=${format(nextDate, "yyyy-MM-dd")}`)
  }

  return (
    <section className="rounded-3xl border border-border bg-card/90 p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-semibold tracking-[0.24em] text-primary uppercase sm:text-sm">
            Daily medication tracker
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Patient medicine schedule
          </h1>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:justify-end">
          <Popover
            open={mobileDateOpen || desktopDateOpen}
            onOpenChange={(open) => {
              setMobileDateOpen(open)
              setDesktopDateOpen(open)
            }}
          >
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
                aria-label={`Choose schedule date, currently ${format(date ?? new Date(), "PPP")}`}
              >
                <CalendarIcon aria-hidden="true" />
                <span>{format(date ?? new Date(), "PP")}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(nextDate) => {
                  changeDate(nextDate)
                  setMobileDateOpen(false)
                  setDesktopDateOpen(false)
                }}
                defaultMonth={date}
              />
            </PopoverContent>
          </Popover>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/medications/create">
              <Plus aria-hidden="true" />
              Add record
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
