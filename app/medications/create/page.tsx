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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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
  getMedicines,
  getPatients,
} from "@/lib/actions"
import { Medicine, Patient } from "@/lib/definitions"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import * as React from "react"

const timeOptions = [
  { value: "morning", label: "Morning" },
  { value: "evening", label: "Evening" },
  { value: "allDay", label: "All Day" },
]

export default function Page() {
  const router = useRouter()
  const anchor = useComboboxAnchor()
  const [patients, setPatients] = React.useState<Patient[]>([])
  const [medicines, setMedicines] = React.useState<Medicine[]>([])
  const [dateFrom, setDate] = React.useState<Date | undefined>(new Date())
  const [dateTo, setDateTo] = React.useState<Date | undefined>(new Date())
  const [dateFromOpen, setDateFromOpen] = React.useState(false)
  const [dateToOpen, setDateToOpen] = React.useState(false)

  React.useEffect(() => {
    getPatients().then(setPatients)
    getMedicines().then(setMedicines)
  }, [])

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Create Medication Record
        </h1>
        <Card className="p-6">
          <CardHeader>
            <CardTitle>Create Medication Record </CardTitle>
            <CardDescription>
              Form for creating a new medication record will be implemented
              here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form id="create-medication-form" action={createMedicationRecord}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <label
                    htmlFor="patient"
                    className="w-24 text-sm font-medium text-foreground"
                  >
                    Patient:
                  </label>
                  <Select name="patient_id" required>
                    <SelectTrigger className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-primary focus:outline-none">
                      <SelectValue placeholder="Select patient" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {patients.map((patient) => (
                          <SelectItem
                            key={patient.id}
                            value={String(patient.id)}
                          >
                            {patient.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label
                    htmlFor="medication"
                    className="w-24 text-sm font-medium text-foreground"
                  >
                    Medication:
                  </label>
                  <Select name="medicine_id" required>
                    <SelectTrigger className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-primary focus:outline-none">
                      <SelectValue placeholder="Select medication" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {medicines.map((medicine) => (
                          <SelectItem
                            key={medicine.id}
                            value={String(medicine.id)}
                          >
                            {medicine.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <label
                    htmlFor="dateFrom"
                    className="w-24 text-sm font-medium text-foreground"
                  >
                    Date from:
                  </label>
                  <Popover open={dateFromOpen} onOpenChange={setDateFromOpen}>
                    <PopoverTrigger asChild>
                      <Button id="dateFrom" type="button" variant="outline">
                        {dateFrom
                          ? format(dateFrom, "yyyy-MM-dd")
                          : "Select Date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Calendar
                        mode="single"
                        selected={dateFrom}
                        onSelect={(date) => {
                          setDate(date)
                          setDateFromOpen(false)
                        }}
                        defaultMonth={dateFrom}
                      />
                    </PopoverContent>
                  </Popover>
                  <Input
                    type="hidden"
                    name="date_from"
                    value={dateFrom ? format(dateFrom, "yyyy-MM-dd") : ""}
                  />
                </div>
                <div className="grid gap-2">
                  <label
                    htmlFor="dateTo"
                    className="w-24 text-sm font-medium text-foreground"
                  >
                    Date to:
                  </label>
                  <Popover open={dateToOpen} onOpenChange={setDateToOpen}>
                    <PopoverTrigger asChild>
                      <Button id="dateTo" type="button" variant="outline">
                        {dateTo ? format(dateTo, "yyyy-MM-dd") : "Select Date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <Calendar
                        mode="single"
                        selected={dateTo}
                        onSelect={(date) => {
                          setDateTo(date)
                          setDateToOpen(false)
                        }}
                        defaultMonth={dateTo}
                      />
                    </PopoverContent>
                  </Popover>
                  <Input
                    type="hidden"
                    name="date_to"
                    value={dateTo ? format(dateTo, "yyyy-MM-dd") : ""}
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
                    className="rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
                <div className="grid gap-2">
                  <label
                    htmlFor="quantity"
                    className="w-24 text-sm font-medium text-foreground"
                  >
                    Quantity:
                  </label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="text"
                    className="rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="timeComboBox">Time:</label>
                  <Combobox
                    multiple
                    autoHighlight
                    name="timeComboBox"
                    required
                    items={timeOptions}
                  >
                    <ComboboxChips className="rounded-md border border-border bg-background px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-primary">
                      <ComboboxValue>
                        {(values) => (
                          <React.Fragment>
                            {values.map((value: string) => (
                              <ComboboxChip key={value}>{value}</ComboboxChip>
                            ))}
                            <ComboboxInput className="h-8 w-full border-0 bg-transparent px-1 text-sm ring-0 focus:ring-0 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50" />
                          </React.Fragment>
                        )}
                      </ComboboxValue>
                    </ComboboxChips>
                    <ComboboxContent anchor={anchor}>
                      <ComboboxEmpty>No time found.</ComboboxEmpty>
                      <ComboboxList>
                        <ComboboxItem key="morning" value="Morning">
                          Morning
                        </ComboboxItem>
                        <ComboboxItem key="evening" value="Evening">
                          Evening
                        </ComboboxItem>
                        <ComboboxItem key="allday" value="All Day">
                          All Day
                        </ComboboxItem>
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
                form="create-medication-form"
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
    </div>
  )
}
