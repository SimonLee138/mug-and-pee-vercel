"use client"

import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PatientRecord, TimeLabel } from "@/lib/definitions"
import { Pill } from "lucide-react"
import { Button } from "@/components/ui/button"
import { updateMedicationCount } from "@/lib/actions"
import { useState } from "react"

type PatientTabRecord = {
  record_id: number
  id: number
  name: string
  description: string
  summary: string
  medicines: Array<{
    record_id: number
    id: number
    name: string
    dose: string
    quantity: number
    quantity_unit: string
    time: TimeLabel
    taken_times: number
  }>
}

function normalizeTimeLabel(value: string): TimeLabel {
  const key = value.toLowerCase().replace(/\s+/g, "")

  if (key === "morning") return "Morning"
  if (key === "evening") return "Evening"

  return "All Day"
}

function timeLabelClass(time: TimeLabel) {
  switch (time) {
    case "Morning":
      return "bg-amber-100 text-amber-900 dark:bg-amber-200/20 dark:text-amber-100"
    case "Evening":
      return "bg-slate-100 text-slate-900 dark:bg-slate-800/80 dark:text-slate-100"
    case "All Day":
      return "bg-emerald-100 text-emerald-900 dark:bg-emerald-200/20 dark:text-emerald-100"
    default:
      return "bg-muted text-foreground"
  }
}

export default function MedicationTabs({
  patientRecords,
}: {
  patientRecords: PatientRecord[]
}) {
  const [takenCounts, setTakenCounts] = useState<Record<number, number>>({})
  const [pendingRecords, setPendingRecords] = useState<Record<number, boolean>>({})
  const [failedRecords, setFailedRecords] = useState<Record<number, boolean>>({})

  const updateTakenCount = async (recordId: number, delta: number) => {
    setPendingRecords((previous) => ({ ...previous, [recordId]: true }))
    setFailedRecords((previous) => ({ ...previous, [recordId]: false }))

    try {
      const savedCount = await updateMedicationCount(recordId, delta)
      setTakenCounts((previous) => ({ ...previous, [recordId]: savedCount }))
    } catch (error) {
      console.error("Could not update medication dose count:", error)
      setFailedRecords((previous) => ({ ...previous, [recordId]: true }))
    } finally {
      setPendingRecords((previous) => ({ ...previous, [recordId]: false }))
    }
  }

  const uniquePatientRecords = Object.values(
    patientRecords.reduce<Record<number, PatientTabRecord>>((acc, record) => {
      const key = record.patient_id

      if (!acc[key]) {
        acc[key] = {
          record_id: record.id,
          id: record.patient_id,
          name: record.patient_name,
          description: "",
          summary: "Today's medication schedule.",
          medicines: [],
        }
      }

      acc[key].medicines.push({
        record_id: record.id,
        id: record.medicine_id,
        name: record.medicine_name,
        dose: record.dose,
        quantity: record.quantity,
        quantity_unit: record.quantity_unit,
        time: normalizeTimeLabel(record.time),
        taken_times: record.taken_times,
      })

      return acc
    }, {})
  )

  if (uniquePatientRecords.length === 0) {
    return (
      <section className="space-y-4 rounded-3xl border border-border bg-card/90 p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">
          No medication records for today.
        </p>
      </section>
    )
  }
  return (
    <Tabs
      defaultValue={String(uniquePatientRecords[0].id)}
      className="flex-col gap-4"
      orientation="vertical"
    >
      <TabsList className="scrollbar-hide flex min-h-[64px] w-full flex-col justify-start gap-2 overflow-x-auto pb-1 md:flex-row md:gap-0 md:overflow-visible">
        {uniquePatientRecords.map((patient) => (
          <TabsTrigger
            key={patient.id}
            value={String(patient.id)}
            className="min-h-[56px] w-full flex-col gap-1 rounded-3xl px-4 py-3 text-left group-data-vertical/tabs:justify-center md:w-auto"
          >
            <span className="text-sm font-semibold text-foreground">
              {patient.name}
            </span>
            {/*
                <span className="text-xs text-muted-foreground">
                  {patient.description}
                </span>*/}
          </TabsTrigger>
        ))}
      </TabsList>

      {uniquePatientRecords.map((patient) => (
        <TabsContent key={patient.id} value={String(patient.id)} className="space-y-6">
          <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-3xl border border-border bg-card/90 p-6 shadow-sm">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Patient
                  </p>
                  <h2 className="mt-1 text-2xl font-semibold text-foreground">
                    {patient.name}
                  </h2>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-primary uppercase">
                  Daily record
                </span>
              </div>
              <p className="text-sm leading-7 text-muted-foreground">
                {patient.summary}
              </p>
            </div>

            <div className="grid gap-3 rounded-3xl border border-border bg-card/90 p-6 shadow-sm">
              <div className="rounded-3xl bg-muted/60 p-4">
                <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
                  Total medicines
                </p>
                <p className="mt-2 text-3xl font-semibold text-foreground">
                  {patient.medicines.length}
                </p>
              </div>
              <div className="rounded-3xl bg-muted/60 p-4">
                <p className="text-xs tracking-[0.24em] text-muted-foreground uppercase">
                  Primary schedule
                </p>
                <p className="mt-2 text-sm leading-6 text-foreground">
                  Morning, evening, and all-day medicines shown in cards below.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {patient.medicines.map((medicine) => {
              const takenCount = takenCounts[medicine.record_id] ?? Math.min(
                medicine.quantity,
                Math.max(0, Number(medicine.taken_times) || 0)
              )
              const isPending = pendingRecords[medicine.record_id] ?? false

              return (
                <div
                  key={`${medicine.record_id}-${medicine.id}-${medicine.time}`}
                  className="rounded-3xl border border-border bg-card/90 p-5 shadow-sm transition hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Medicine
                      </p>
                      <h3 className="mt-2 text-xl font-semibold text-foreground">
                        {medicine.name}
                      </h3>
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-semibold uppercase",
                        timeLabelClass(medicine.time)
                      )}
                    >
                      {medicine.time}
                    </span>
                  </div>

                  <div className="mt-5 space-y-3 text-sm leading-6 text-muted-foreground">
                    <p>
                      <span className="font-semibold text-foreground">Dose:</span>{" "}
                      {medicine.dose}
                    </p>
                    <p>
                      <span className="font-semibold text-foreground">Scheduled:</span>{" "}
                      {medicine.quantity} {medicine.quantity_unit}
                    </p>
                    <div
                      className="flex items-center gap-2"
                      role="img"
                      aria-label={`${takenCount} of ${medicine.quantity} doses taken`}
                    >
                      {Array.from({ length: medicine.quantity }).map((_, index) => (
                        <Pill
                          key={index}
                          aria-hidden="true"
                          className={cn(
                            "h-5 w-5",
                            index < takenCount
                              ? "fill-primary text-primary"
                              : "text-muted-foreground/40"
                          )}
                        />
                      ))}
                      <span className="font-medium text-foreground">
                        {takenCount} of {medicine.quantity} taken
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={isPending || takenCount >= medicine.quantity}
                        onClick={() => updateTakenCount(medicine.record_id, 1)}
                      >
                        <Pill aria-hidden="true" />
                        Mark dose taken
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        disabled={isPending || takenCount === 0}
                        onClick={() => updateTakenCount(medicine.record_id, -1)}
                      >
                        Undo last
                      </Button>
                    </div>
                    <p aria-live="polite" className="min-h-5 text-xs">
                      {isPending
                        ? "Saving dose status…"
                        : failedRecords[medicine.record_id]
                          ? "Could not save this update. Please try again."
                          : ""}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
