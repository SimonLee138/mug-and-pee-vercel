import { getCurrentScheduleDate, getPatientRecords } from "@/lib/actions"
import MedicationTabs from "@/components/medications/medication-tabs"
import MedicationCard from "@/components/medications/medication-card"

function isValidDate(value: string | undefined): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false

  const date = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>
}) {
  const { date } = await searchParams
  const selectedDate = isValidDate(date) ? date : await getCurrentScheduleDate()
  const patientRecords = await getPatientRecords(selectedDate)

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <MedicationCard selectedDate={selectedDate} />
        <MedicationTabs patientRecords={patientRecords} selectedDate={selectedDate} />
      </div>
    </div>
  )
}
