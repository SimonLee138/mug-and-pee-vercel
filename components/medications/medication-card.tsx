"use client"

import {
  Calendar as CalendarIcon,
  PencilLine,
  Plus,
  Trash2,
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
import { format } from "date-fns"

export default function MedicationCard() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [dateOpen, setDateOpen] = React.useState(false)

  return (
    <div>
      <div className="mb-2 flex justify-between">
        <div className="flex h-fit w-fit flex-none gap-2 rounded-3xl border border-border bg-card/90 p-3 shadow-sm md:hidden">
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger asChild>
              <CalendarIcon id="date" className="h-6 w-6" />
            </PopoverTrigger>
            <PopoverContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => {
                  setDate(date)
                  setDateOpen(false)
                }}
                defaultMonth={date}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex h-fit w-fit flex-none gap-2 rounded-3xl border border-border bg-card/90 p-3 shadow-sm md:hidden">
          <Plus className="h-6 w-6" />
          <PencilLine className="h-6 w-6" />
          <Trash2 className="h-6 w-6" />
        </div>
      </div>

      <section className="flex space-y-4 rounded-3xl border border-border bg-card/90 p-6 shadow-sm">
        <div className="flex grow flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium tracking-[0.3em] text-muted-foreground uppercase">
              Daily medication tracker
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Patient medicine schedule
            </h1>
          </div>
        </div>
        <div className="hidden flex-none gap-2 md:flex">
          <div className="h-fit w-fit rounded-3xl border border-border bg-card/90 p-3 shadow-sm">
            <Popover open={dateOpen} onOpenChange={setDateOpen}>
              <PopoverTrigger asChild>
                <Button id="dateFrom" type="button" variant="outline">
                  <CalendarIcon id="date" className="h-6 w-6" />
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => {
                    setDate(date)
                    setDateOpen(false)
                  }}
                  defaultMonth={date}
                />
              </PopoverContent>
            </Popover>
          </div>
          <Link
            href="/medications/create"
            className="h-fit w-fit rounded-3xl border border-border bg-card/90 p-3 shadow-sm"
          >
            <Plus className="h-4 w-4" />
          </Link>
          <div className="h-fit w-fit rounded-3xl border border-border bg-card/90 p-3 shadow-sm">
            <PencilLine className="h-4 w-4" />
          </div>
          <div className="h-fit w-fit rounded-3xl border border-border bg-card/90 p-3 shadow-sm">
            <Trash2 className="h-4 w-4" />
          </div>
        </div>
      </section>
    </div>
  )
}
