import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PatientRecord, TimeLabel } from "@/lib/definitions"

type PatientTabRecord = {
  id: string
  name: string
  description: string
  summary: string
  medicines: Array<{
    id: number
    name: string
    dose: string
    count: string
    time: TimeLabel
  }>
}

const TIME_ORDER: Record<string, number> = {
  morning: 2,
  evening: 3,
  allday: 1,
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
  const uniquePatientRecords = Object.values(
    patientRecords.reduce<Record<number, PatientTabRecord>>((acc, record) => {
      const key = record.patient_id

      if (!acc[key]) {
        acc[key] = {
          id: String(record.patient_id),
          name: record.patient_name,
          description: "",
          summary: "Today's medication schedule.",
          medicines: [],
        }
      }

      record.time.split(",").forEach((time) => {
        acc[key].medicines.push({
          id: record.medicine_id,
          name: record.medicine_name,
          dose: record.dose,
          count: record.count,
          time: normalizeTimeLabel(time.trim()),
        })
      })

      return acc
    }, {})
  ).map((patient) => ({
    ...patient,
    medicines: [...patient.medicines].sort((a, b) => {
      const aOrder = TIME_ORDER[a.time.toLowerCase().replace(/\s+/g, "")] ?? 99
      const bOrder = TIME_ORDER[b.time.toLowerCase().replace(/\s+/g, "")] ?? 99

      if (aOrder !== bOrder) {
        return aOrder - bOrder
      }

      return a.name.localeCompare(b.name)
    }),
  }))

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
      defaultValue={uniquePatientRecords[0].id}
      className="flex-col gap-4"
      orientation="vertical"
    >
      <TabsList className="scrollbar-hide flex min-h-[64px] w-full flex-col justify-start gap-2 overflow-x-auto pb-1 md:flex-row md:gap-0 md:overflow-visible">
        {uniquePatientRecords.map((patient) => (
          <TabsTrigger
            key={patient.id}
            value={patient.id}
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
        <TabsContent key={patient.id} value={patient.id} className="space-y-6">
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
            {patient.medicines.map((medicine) => (
              <div
                key={`${medicine.id}-${medicine.time}`}
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
                      timeLabelClass(medicine.time as TimeLabel)
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
                    <span className="font-semibold text-foreground">
                      Count:
                    </span>{" "}
                    {medicine.count}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
