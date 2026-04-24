import MedicineCard from "@/components/medicines/medicine-card"
import { getMedicineChildMedicines, getMedicines } from "@/lib/actions"

export default async function Page() {
  const medicines = await getMedicines()
  const getMedicineChildren = await getMedicineChildMedicines()
  const medicinesWithChildren = medicines.map((medicine) => ({
    ...medicine,
    childMedicines: getMedicineChildren.filter(
      (child) => child.parent_id === medicine.id
    ),
  }))
  
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 bg-background px-6 py-8">
      <section className="flex space-y-4 rounded-3xl border border-border bg-card/90 p-6 shadow-sm">
        <div className="flex grow flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium tracking-[0.3em] text-muted-foreground uppercase">
              Medicines
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Medicine list
            </h1>
          </div>
        </div>
      </section>

      <MedicineCard medicines={medicinesWithChildren} />
    </div>
  )
}
