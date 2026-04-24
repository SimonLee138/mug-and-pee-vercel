import MedicineForm from "@/components/medicines/medicine-form"
import { getMedicineById, getMedicineChildByParentId } from "@/lib/actions"
import { MedicationForm, MedicineWithChild } from "@/lib/definitions"
import * as React from "react"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const medicine = await getMedicineById(Number(id))
  const medicineChilds = await getMedicineChildByParentId(Number(id))
  const medicinesWithChildren: MedicationForm = {
    ...medicine,
    childMedicines: medicineChilds
  } as MedicationForm
  return (
    <div>
      <MedicineForm medicine={medicinesWithChildren} />
    </div>
  )
}
