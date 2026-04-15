import { getPatientRecords } from "@/lib/actions"
import MedicationTabs from "@/components/medications/medication-tabs"
import MedicationCard from "@/components/medications/medication-card"

export default async function Page() {
  const patientRecords = await getPatientRecords()

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <MedicationCard />
        <MedicationTabs patientRecords={patientRecords} />
      </div>
    </div>
  )
}
