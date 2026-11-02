"use server"

import { refresh, revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { sql } from "@/lib/db"
import { ChildMedicine, Medicine, MedicineChildMedicines, Patient, PatientRecord } from "./definitions"

interface MedicinePayload {
  id: number
  name: string
  description: string
  dose: string
  childMedicines: MedicineChildMedicines[]
  [key: string]: string | number[] | number | MedicineChildMedicines[] // fallback for other fields
}

export async function getMedicines() {
  try {
    const rows = (await sql`SELECT * FROM medicine`) as Medicine[]
    return rows
  } catch (error) {
    console.error("Error fetching medicines:", error)
    return []
  }
}

export async function getMedicineById(id: number) {
  try {
    const rows =
      (await sql`SELECT * FROM medicine WHERE id = ${id}`) as Medicine[]
    return rows[0] || null
  } catch (error) {
    console.error(`Error fetching medicine with id ${id}:`, error)
    return null
  }
}

export async function getPatients() {
  try {
    const rows = (await sql`SELECT * FROM patient`) as Patient[]
    return rows
  } catch (error) {
    console.error("Error fetching patients:", error)
    return []
  }
}

export async function getPatientRecords() {
  try {
    const rows =
      (await sql`select ms.id as id, p.id as patient_id, p.name as patient_name, m.id as medicine_id, m.name as medicine_name, 
      ms.time_label as time, ms.dose as dose, ms.quantity as quantity, ms.quantity_unit as quantity_unit, ms.taken_times as taken_times 
      from medication_schedule ms 
      join medicine m on ms.medicine_id = m.id
      join patient p on ms.patient_id = p.id
      where start_date <= CURRENT_DATE and end_date >= CURRENT_DATE order by 
      case
        when ms.time_label = 'All Day' then 1
        when ms.time_label = 'Morning' then 2
        when ms.time_label = 'Evening' then 3
        else 4
        end asc`) as PatientRecord[]
    return rows
  } catch (error) {
    console.error("Error fetching patient records:", error)
    return []
  }
}

export async function createMedicationRecord(
  formData: FormData
): Promise<void> {
  const patientId = Number(formData.get("patient_id"))
  const medicineId = Number(formData.get("medicine_id"))
  const dose = String(formData.get("dose") ?? "").trim()
  const quantity = Number(formData.get("quantity"))
  const quantityUnit = String(formData.get("quantity_unit") ?? "").trim()
  const startDate = String(formData.get("date_from") ?? "")
  const endDate = String(formData.get("date_to") ?? "")
  const validTimes = new Set(["Morning", "Evening", "All Day"])
  const timeslots = formData
    .getAll("timeComboBox")
    .filter((time): time is string => typeof time === "string")

  const isValidDate = (value: string) => {
    const date = new Date(`${value}T00:00:00.000Z`)
    return /^\d{4}-\d{2}-\d{2}$/.test(value) &&
      !Number.isNaN(date.getTime()) &&
      date.toISOString().slice(0, 10) === value
  }

  if (
    !Number.isInteger(patientId) || patientId <= 0 ||
    !Number.isInteger(medicineId) || medicineId <= 0 ||
    !dose || !Number.isInteger(quantity) || quantity <= 0 || !quantityUnit ||
    !isValidDate(startDate) || !isValidDate(endDate) || startDate > endDate ||
    timeslots.length === 0 || timeslots.some((time) => !validTimes.has(time)) ||
    new Set(timeslots).size !== timeslots.length
  ) {
    throw new Error("Please complete the medication form with valid values.")
  }

  try {
    await sql.transaction(
      timeslots.map(
        (time) => sql`
          INSERT INTO medication_schedule
            (patient_id, medicine_id, time_label, dose, quantity, quantity_unit, start_date, end_date)
          VALUES
            (${patientId}, ${medicineId}, ${time}, ${dose}, ${quantity}, ${quantityUnit}, ${startDate}, ${endDate})
        `
      )
    )
  } catch (error) {
    console.error("Error creating medication record:", error)
    throw new Error("Could not save the medication record. Please try again.")
  }

  revalidatePath("/medications")
  redirect("/medications")
}

export async function updateMedicationCount(
  recordId: number,
  newCount: number
): Promise<void> {
  try {
    console.log(`Updating record ${recordId} with new count: ${newCount}`)
    await sql`UPDATE medication_schedule SET taken_times = ${newCount} WHERE id = ${recordId}`
  } catch (error) {
    console.error("Error updating medication count:", error)
  }
}

export async function deleteMedicationRecord(recordId: number): Promise<void> {
  try {
    await sql`DELETE FROM medication_schedule WHERE id = ${recordId}`
  } catch (error) {
    console.error("Error deleting medication record:", error)
  }
}

export async function createMedicine(childMedicines: MedicineChildMedicines[], formData: FormData): Promise<void> {
  try {
    const payload = {
      ...Object.fromEntries(formData.entries()),
      childMedicines,
    }

    const {
      name: name,
      description: description,
      dose: dose,
    } = payload as MedicinePayload

    const result = await sql`INSERT INTO medicine (name, description, dose) 
      VALUES (${name}, ${description}, ${dose}) returning id`
    const medicineId = result[0]?.id

    for (const childMedicine of childMedicines) {
      await sql`INSERT INTO medicine_child_medicines (medicine_id, child_id, dose, created_date) 
      VALUES (${medicineId}, ${childMedicine.child_id}, ${childMedicine.dose}, NOW())`
    }
  } catch (error) {
    console.error("Error creating medicine:", error)
  }

  revalidatePath("/medicines")
  redirect("/medicines")
}

export async function updateMedicine(
  id: number,
  childMedicines: MedicineChildMedicines[],
  formData: FormData
): Promise<void> {
  try {
    const payload = {
      ...Object.fromEntries(formData.entries()),
      //childMedicines: formData.getAll("childMedicines").map(Number),
      childMedicines,
    }

    const {
      name,
      description,
      dose,
      childMedicines: payloadChildMedicines,
    } = payload as MedicinePayload

    console.log(`Updating medicine with id: ${id}`)
    console.log(`New values - Name: ${name}, Description: ${description}, Dose: ${dose}`)
    console.log(`Child medicines count: ${payloadChildMedicines.length}`)
    await sql`UPDATE medicine SET name = ${name}, description = ${description}, dose = ${dose} WHERE id = ${id}`

    const normalizedChildMedicines = payloadChildMedicines
      .filter((child) => Number(child.child_id) > 0)
      .map((child) => ({
        child_id: Number(child.child_id),
        dose: String(child.dose ?? ""),
      }))

    const uniqueByChildId = Array.from(
      new Map(
        normalizedChildMedicines.map((child) => [child.child_id, child])
      ).values()
    )

    await sql`DELETE FROM medicine_child_medicines WHERE medicine_id = ${id}`

    for (const childMedicine of uniqueByChildId) {
      await sql`INSERT INTO medicine_child_medicines (medicine_id, child_id, dose, created_date)
      VALUES (${id}, ${childMedicine.child_id}, ${childMedicine.dose}, NOW())`
    }
  } catch (error) {
    console.error("Error updating medicine:", error)
  }

  revalidatePath("/medicines")
  redirect("/medicines")
}

export async function deleteMedicine(recordId: number): Promise<void> {
  try {
    await sql`DELETE FROM medicine WHERE id = ${recordId}`
    await sql`DELETE FROM medicine_child_medicines WHERE medicine_id = ${recordId}`
    refresh()
  } catch (error) {
    console.error("Error deleting medicine:", error)
  }
}

export async function getMedicineChildMedicines(): Promise<ChildMedicine[]> {
  try {
    const rows = await sql`
      SELECT mcm.medicine_id as parent_id, m.* FROM medicine_child_medicines mcm
      JOIN medicine m ON mcm.child_id = m.id
    `
    return rows as ChildMedicine[]
  } catch (error) {
    console.error("Error fetching child medicines:", error)
    return []
  }
}

export async function getMedicinesByIds(ids: number[]): Promise<Medicine[]> {
  try {
    if (ids.length === 0) return []
    const rows = await sql`SELECT * FROM medicine WHERE id IN (${ids})`
    return rows as Medicine[]
  } catch (error) {
    console.error("Error fetching medicines by ids:", error)
    return []
  }
}

export async function getMedicineChildByParentId(id: number): Promise<MedicineChildMedicines[]> {
  try {
    const rows = await sql`SELECT * FROM medicine_child_medicines WHERE medicine_id = ${id}`
    return rows as MedicineChildMedicines[]
  } catch (error) {
    console.error("Error fetching medicines by ids:", error)
    return []
  }
}