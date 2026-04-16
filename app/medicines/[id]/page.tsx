import MedicineForm from "@/components/medicines/medicine-form"
import { getMedicineById } from "@/lib/actions"
import * as React from "react"

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const medicine = await getMedicineById(Number(id))

  return (
    <div>
      <MedicineForm medicine={medicine} />
    </div>
  )
}
