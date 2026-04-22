"use server"

import { sql } from "@/lib/db"
import { ChildMedicine, Medicine, Patient, PatientRecord } from "./definitions"

interface MedicationPayload {
  id: number
  patient_id: number
  medicine_id: number
  date_from: string
  date_to: string
  dose: string
  quantity: number
  quantity_unit: string
  timeComboBox: string[]
  [key: string]: string | string[] | number // fallback for other fields
}

interface MedicinePayload {
  id: number
  name: string
  description: string
  dose: string
  childMedicines: number[]
  [key: string]: string | number[] | number // fallback for other fields
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
  try {
    const payload = {
      ...Object.fromEntries(formData.entries()),
      timeComboBox: formData.getAll("timeComboBox"),
    }

    const {
      patient_id: patient_id,
      medicine_id: medicine_id,
      timeComboBox: timeslots,
      dose: dose,
      quantity: quantity,
      quantity_unit: quantity_unit,
      date_from: start_date,
      date_to: end_date,
    } = payload as MedicationPayload

    timeslots.forEach(async (time) => {
      await sql`INSERT INTO medication_schedule (patient_id, medicine_id, time_label, dose, quantity, quantity_unit, start_date, end_date) 
      VALUES (${patient_id}, ${medicine_id}, ${time}, ${dose}, ${quantity}, ${quantity_unit}, ${start_date}, ${end_date})`
    })
  } catch (error) {
    console.error("Error creating medication record:", error)
  }
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

export async function createMedicine(formData: FormData): Promise<void> {
  try {
    const payload = {
      ...Object.fromEntries(formData.entries()),
      childMedicines: formData.getAll("childMedicines").map(Number),
    }

    const {
      name: name,
      description: description,
      childMedicines: childMedicines,
      dose: dose,
    } = payload as MedicinePayload

    const result = await sql`INSERT INTO medicine (name, description, dose) 
      VALUES (${name}, ${description}, ${dose}) returning id`
    const medicineId = result[0]?.id
    console.log(childMedicines)
    childMedicines.forEach(async (childMedicineId) => {
      await sql`INSERT INTO medicine_child_medicines (medicine_id, child_id, created_date) 
      VALUES (${medicineId}, ${childMedicineId}, NOW())`
    })
  } catch (error) {
    console.error("Error creating medicine:", error)
  }
}

export async function updateMedicine(
  id: number,
  formData: FormData
): Promise<void> {
  try {
    const payload = {
      ...Object.fromEntries(formData.entries()),
      childMedicines: formData.getAll("childMedicines").map(Number),
    }

    const {
      name,
      description,
      dose,

    } = payload as MedicinePayload

    console.log(`Updating medicine with id: ${id}`)
    console.log(`New values - Name: ${name}, Description: ${description}, Dose: ${dose}`) 
    //await sql`UPDATE medicine SET name = ${name}, description = ${description}, dose = ${dose} WHERE id = ${id}`
  } catch (error) {
    console.error("Error updating medicine:", error)
  }
}

export async function deleteMedicine(recordId: number): Promise<void> {
  try {
    await sql`DELETE FROM medication_schedule WHERE id = ${recordId}`
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