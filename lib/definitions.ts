export type Medicine = {
  id: number
  created_at: Date
  name: string
  description: string
  dose: string
}

export type MedicineChildMedicines = {
  id: number
  medicine_id: number
  child_id: number
  created_date: Date
}

export type Patient = {
  id: number
  name: string
  img_src: string
  created_at: Date
  description: string
  summary: string
}

export type TimeLabel = "Morning" | "Evening" | "All Day"

export type PatientRecord = {
  id: number
  patient_id: number
  patient_name: string
  medicine_id: number
  medicine_name: string
  time: TimeLabel
  dose: string
  quantity: number
  quantity_unit: string
  taken_times: number
}

export type MedicationScheduleEntry = {
  patient_name: string
  medicine_name: string
  effective_date: Date
  taken: boolean
  img_src: string
}

export type DailyMedicationSchedule = {
  date: Date
  entries: Patient[]
}
