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
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  createMedicine,
  getMedicines,
  updateMedicine,
} from "@/lib/actions"
import { MedicationForm, Medicine, MedicineChildMedicines, MedicineWithChild, Patient } from "@/lib/definitions"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import * as React from "react"
import { Checkbox } from "../ui/checkbox"
import { Plus } from "lucide-react"

const doses = ["1/4", "1/3", "1/2", "1", "2", "3", "4"]

export default function MedicineForm({
  medicine,
}: {
  medicine: MedicationForm | null
}) {
  const router = useRouter()
  const anchor = useComboboxAnchor()
  const [medicineList, setMedicineList] = React.useState<Medicine[]>([])
  const [childMedicines, setChildMedicines] = React.useState<MedicineChildMedicines[]>(
    medicine ? medicine.childMedicines : []
  )

  React.useEffect(() => {
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
                await updateMedicine(medicine.id, childMedicines, formData)
              } else {
                await createMedicine(childMedicines, formData)
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
              {/*<div className="grid gap-2">
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
                    <ComboboxEmpty>No medicine found.</ComboboxEmpty>
                    <ComboboxList>
                      {medicineList.map((medicine) => (
                        <ComboboxItem key={medicine.id} value={String(medicine.id)}>
                          {medicine.name}
                        </ComboboxItem>
                      ))}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </div>*/}
              <div className="flex items-center">
                <p className="w-24 text-sm font-medium text-foreground">
                  Contents:
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setChildMedicines((current) => [
                      ...current,
                      { child_id: 0, dose: "", } as MedicineChildMedicines,
                    ])
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2 grid grid-cols gap-2">
                {childMedicines.map((child, index) => (
                  <div
                    key={index}
                    className="grid md:w-fit grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-3 rounded-md border border-border bg-background px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-primary md:grid-cols-[4.5rem_minmax(0,12rem)_3rem_minmax(0,12rem)]"
                  >
                    <span className="text-sm">Medicine:</span>
                    <Select onValueChange={(value) => {
                      const selectedMedicine = medicineList.find(med => String(med.id) === value)
                      if (selectedMedicine) {
                        const updatedChildMedicines = [...childMedicines]
                        updatedChildMedicines[index] = {
                          child_id: selectedMedicine.id,
                          dose: updatedChildMedicines[index]?.dose || "",
                        } as MedicineChildMedicines
                        setChildMedicines(updatedChildMedicines)
                      }
                    }} value={childMedicines[index]?.child_id ? String(childMedicines[index].child_id) : ""}>
                      <SelectTrigger className="w-full max-w-48">
                        <SelectValue placeholder="Select a medicine" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Medicines</SelectLabel>
                          {medicineList.map((medicine) => (
                            <SelectItem key={medicine.id} value={String(medicine.id)}>
                              {medicine.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    <span className="text-sm">Dose:</span>
                    <Select onValueChange={(value) => {
                      const updatedChildMedicines = [...childMedicines]
                      updatedChildMedicines[index] = {
                        child_id: updatedChildMedicines[index]?.child_id || 0,
                        dose: value,
                      } as MedicineChildMedicines
                      setChildMedicines(updatedChildMedicines)
                    }} value={childMedicines[index]?.dose || ""}>
                      <SelectTrigger className="w-full max-w-48">
                        <SelectValue placeholder="Select the dose" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Doses</SelectLabel>
                          {doses.map((dose, doseIndex) => (
                            <SelectItem key={doseIndex} value={dose}>{dose}</SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
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
