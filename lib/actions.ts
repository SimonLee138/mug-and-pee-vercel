"use server"

import { sql } from "@/lib/db"
import { Medicine, Patient, PatientRecord } from "./definitions"

interface MedicationPayload {
  patient_id: string
  medication_id: string
  date_from: string
  date_to: string
  dose: string
  quantity: string
  timeComboBox: string[]
  [key: string]: string | string[] // fallback for other fields
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
      (await sql`select p.id as patient_id, p.name as patient_name, m.id as medicine_id, m.name as medicine_name, 
      ms.time_label as time, ms.dose as dose, ms.quantity_text as count, CURRENT_DATE from medication_schedule ms 
      join medicine m on ms.medicine_id = m.id
      join patient p on ms.patient_id = p.id
      where start_date <= CURRENT_DATE and end_date >= CURRENT_DATE`) as PatientRecord[]
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
      quantity: quantity_text,
      date_from: start_date,
      date_to: end_date,
    } = payload as MedicationPayload

    await sql`INSERT INTO medication_schedule (patient_id, medicine_id, time_label, dose, quantity_text, start_date, end_date) 
    VALUES (${patient_id}, ${medicine_id}, ${timeslots.join(",")}, ${dose}, ${quantity_text}, ${start_date}, ${end_date})`
  } catch (error) {
    console.error("Error creating medication record:", error)
  }
}
