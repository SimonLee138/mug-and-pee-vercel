"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
import { MedicationForm, Medicine, MedicineChildMedicines } from "@/lib/definitions"
import { useRouter } from "next/navigation"
import * as React from "react"
import { Plus, Trash2 } from "lucide-react"

const doses = ["1/4", "1/3", "1/2", "1", "2", "3", "4"]

export default function MedicineForm({
  medicine,
}: {
  medicine: MedicationForm | null
}) {
  const router = useRouter()
  const [medicineList, setMedicineList] = React.useState<Medicine[]>([])
  const [isMedicineListLoading, setIsMedicineListLoading] = React.useState(true)
  const [contentsError, setContentsError] = React.useState("")
  const [childMedicines, setChildMedicines] = React.useState<MedicineChildMedicines[]>(
    medicine ? medicine.childMedicines : []
  )
  const selectableMedicines = medicineList.filter(
    (item) => item.id !== medicine?.id
  )

  React.useEffect(() => {
    getMedicines()
      .then(setMedicineList)
      .finally(() => setIsMedicineListLoading(false))
  }, [])

  const updateChild = (
    index: number,
    changes: Partial<MedicineChildMedicines>
  ) => {
    setChildMedicines((current) =>
      current.map((child, childIndex) =>
        childIndex === index ? { ...child, ...changes } : child
      )
    )
    setContentsError("")
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        {medicine ? "Edit Medicine Record" : "Create Medicine Record"}
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
            onSubmit={(event) => {
              const hasIncompleteRow = childMedicines.some(
                (child) => !child.child_id || !child.dose
              )
              const hasDuplicate = new Set(
                childMedicines.map((child) => child.child_id).filter(Boolean)
              ).size !== childMedicines.filter((child) => child.child_id).length

              if (hasIncompleteRow || hasDuplicate) {
                event.preventDefault()
                setContentsError(
                  hasDuplicate
                    ? "Each content medicine can only be added once."
                    : "Complete or remove each content row before saving."
                )
              }
            }}
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
                  htmlFor="name"
                  className="w-24 text-sm font-medium text-foreground"
                >
                  Medication:
                </label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  required
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
                  required
                  defaultValue={medicine ? medicine.dose : ""}
                  className="rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-sm font-semibold text-foreground">
                        Contents <span className="font-normal text-muted-foreground">(optional)</span>
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Add the medicines included in this medicine and their doses.
                      </p>
                    </div>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isMedicineListLoading || selectableMedicines.length === 0}
                  onClick={() => {
                        setChildMedicines((current) => [
                          ...current,
                          {
                            id: 0,
                            medicine_id: medicine?.id ?? 0,
                            child_id: 0,
                            dose: "",
                            created_date: new Date(),
                          },
                        ])
                        setContentsError("")
                      }}
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                      Add content
                </Button>
              </div>
              {isMedicineListLoading && (
                <p className="text-sm text-muted-foreground" role="status">
                  Loading available medicines…
                </p>
              )}
              {!isMedicineListLoading && selectableMedicines.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Add another medicine before adding contents here.
                </p>
              )}
                  {contentsError && (
                    <p role="alert" className="text-sm text-destructive">
                      {contentsError}
                    </p>
                  )}
                  {childMedicines.length === 0 ? (
                    <p className="rounded-md border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
                      No contents added. Use “Add content” if this medicine contains other medicines.
                    </p>
                  ) : (
                    <div className="grid gap-3">
                      {childMedicines.map((child, index) => {
                        const selectedByOtherRow = new Set(
                          childMedicines
                            .filter((_, childIndex) => childIndex !== index)
                            .map((item) => item.child_id)
                        )

                        return (
                          <div
                            key={`${child.id}-${index}`}
                            className="grid gap-3 rounded-lg border border-border bg-background p-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end"
                          >
                            <div className="grid gap-2">
                              <label
                                htmlFor={`content-medicine-${index}`}
                                className="text-sm font-medium text-foreground"
                              >
                                Content medicine
                              </label>
                              <Select
                                value={child.child_id ? String(child.child_id) : ""}
                                onValueChange={(value) => {
                                  const selectedMedicine = selectableMedicines.find(
                                    (item) => String(item.id) === value
                                  )
                                  if (selectedMedicine) {
                                    updateChild(index, { child_id: selectedMedicine.id })
                                  }
                                }}
                              >
                                <SelectTrigger
                                  id={`content-medicine-${index}`}
                                  className="w-full"
                                  aria-label={`Content medicine ${index + 1}`}
                                >
                                  <SelectValue placeholder="Select a medicine" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Medicines</SelectLabel>
                                    {selectableMedicines.map((item) => (
                                      <SelectItem
                                        key={item.id}
                                        value={String(item.id)}
                                        disabled={selectedByOtherRow.has(item.id)}
                                      >
                                        {item.name}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="grid gap-2">
                              <label
                                htmlFor={`content-dose-${index}`}
                                className="text-sm font-medium text-foreground"
                              >
                                Content dose
                              </label>
                              <Select
                                value={child.dose || ""}
                                onValueChange={(value) => updateChild(index, { dose: value })}
                              >
                                <SelectTrigger
                                  id={`content-dose-${index}`}
                                  className="w-full"
                                  aria-label={`Dose for content medicine ${index + 1}`}
                                >
                                  <SelectValue placeholder="Select a dose" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Doses</SelectLabel>
                                    {doses.map((dose) => (
                                      <SelectItem key={dose} value={dose}>
                                        {dose}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            </div>

                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              aria-label={`Remove content medicine ${index + 1}`}
                              onClick={() => {
                                setChildMedicines((current) =>
                                  current.filter((_, childIndex) => childIndex !== index)
                                )
                                setContentsError("")
                              }}
                            >
                              <Trash2 className="h-4 w-4" aria-hidden="true" />
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                    )}
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
              { medicine ? "Update Record" : "Create Record" }
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
