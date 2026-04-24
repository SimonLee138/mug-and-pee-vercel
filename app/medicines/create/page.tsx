import MedicineForm from "@/components/medicines/medicine-form"

export default async function Page() {
  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <MedicineForm medicine={null} />
    </div>
  )
}
