"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  createMedicationRecord,
  createMedicine,
  getMedicines,
  getPatients,
  updateMedicine,
} from "@/lib/actions"
import { Medicine, Patient } from "@/lib/definitions"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import * as React from "react"

export default function MedicineForm({
  medicine,
}: {
  medicine: Medicine | null
}) {
  const router = useRouter()
  const anchor = useComboboxAnchor()
  const [patients, setPatients] = React.useState<Patient[]>([])
  const [medicineList, setMedicineList] = React.useState<Medicine[]>([])

  React.useEffect(() => {
    getPatients().then(setPatients)
    getMedicines().then(setMedicineList)
  }, [])

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        {medicine ? "Edit Meidicine Record" : "Create Medicine Record"}
      </h1>
      <Card className="p-6">
        <CardHeader>
          <CardTitle>
            {medicine ? "Edit Medicine Record" : "Create Medicine Record"}
          </CardTitle>
          <CardDescription>
            {medicine
              ? "Form for editing an existing medicine record."
              : "Form for creating a new medicine record."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            id="create-medicine-form"
            action={async (formData) => {
              if (medicine) {
                await updateMedicine(medicine.id, formData)
              } else {
                await createMedicine(formData)
              }
            }}
          >
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <label
                  htmlFor="medication"
                  className="w-24 text-sm font-medium text-foreground"
                >
                  Medication:
                </label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  defaultValue={medicine ? medicine.name : ""}
                  className="rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
              <div className="grid gap-2">
                <label
                  htmlFor="description"
                  className="w-24 text-sm font-medium text-foreground"
                >
                  Description:
                </label>
                <Input
                  type="text"
                  id="description"
                  name="description"
                  defaultValue={medicine ? medicine.description : ""}
                  className="rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
              <div className="grid gap-2">
                <label
                  htmlFor="dose"
                  className="w-24 text-sm font-medium text-foreground"
                >
                  Dose:
                </label>
                <Input
                  type="text"
                  id="dose"
                  name="dose"
                  defaultValue={medicine ? medicine.dose : ""}
                  className="rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="childMedicines">Content:</label>
                <Combobox
                  multiple
                  autoHighlight
                  name="childMedicines"
                  required
                  items={medicineList}
                >
                  <ComboboxChips className="rounded-md border border-border bg-background px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-primary">
                    <ComboboxValue>
                      {(values) => (
                        <React.Fragment>
                          {values.map((value: string) => (
                            <ComboboxChip key={value}>
                              {medicineList.find((item) => String(item.id) === value)
                                ?.name ?? value}
                            </ComboboxChip>
                          ))}
                          <ComboboxInput className="h-8 w-full border-0 bg-transparent px-1 text-sm ring-0 focus:ring-0 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50" />
                        </React.Fragment>
                      )}
                    </ComboboxValue>
                  </ComboboxChips>
                  <ComboboxContent anchor={anchor}>
                    <ComboboxEmpty>No time found.</ComboboxEmpty>
                    <ComboboxList>
                      {medicineList.map((medicine) => (
                        <ComboboxItem key={medicine.id} value={String(medicine.id)}>
                          {medicine.name}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <div className="flex gap-2">
            <button
              form="create-medicine-form"
              type="submit"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:outline-none"
              onClick={() => {
                router.push("/medicines")
              }}
            >
              Create Record
            </button>
            <button
              type="button"
              className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted/50 focus:ring-2 focus:ring-primary focus:outline-none"
              onClick={() => {
                router.back()
              }}
            >
              Cancel
            </button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
