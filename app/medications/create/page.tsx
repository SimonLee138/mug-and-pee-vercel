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
  { value: "Morning", label: "Morning" },
  { value: "Evening", label: "Evening" },
  { value: "All Day", label: "All Day" },
]

export default function Page() {
  const router = useRouter()
  const anchor = useComboboxAnchor()
  const [formState, formAction, isPending] = React.useActionState(
    createMedicationRecord,
    { error: "" }
  )
  const [patients, setPatients] = React.useState<Patient[]>([])
  const [medicines, setMedicines] = React.useState<Medicine[]>([])
  const [dateFrom, setDate] = React.useState<Date | undefined>(new Date())
  const [dateTo, setDateTo] = React.useState<Date | undefined>(new Date())
  const [dateFromOpen, setDateFromOpen] = React.useState(false)
  const [dateToOpen, setDateToOpen] = React.useState(false)
  const [selectedTimes, setSelectedTimes] = React.useState<string[]>([])
  const [clientError, setClientError] = React.useState("")
  const [serverErrorDismissed, setServerErrorDismissed] = React.useState(false)

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
              Choose a patient, medicine, schedule, and dose details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              id="create-medication-form"
              noValidate
              action={formAction}
              onChange={() => {
                setClientError("")
                setServerErrorDismissed(true)
              }}
              onSubmit={(event) => {
                const formData = new FormData(event.currentTarget)
                const quantityValue = String(formData.get("quantity") ?? "").trim()
                const quantity = Number(quantityValue)
                const startDate = String(formData.get("date_from") ?? "")
                const endDate = String(formData.get("date_to") ?? "")
                const timeSlots = formData.getAll("timeComboBox")
                const validTimeSlots = new Set(["Morning", "Evening", "All Day"])

                let error = ""
                if (!formData.get("patient_id")) {
                  error = "Select a patient."
                } else if (!formData.get("medicine_id")) {
                  error = "Select a medicine."
                } else if (!startDate || !endDate) {
                  error = "Choose both a start date and an end date."
                } else if (startDate > endDate) {
                  error = "The end date must be on or after the start date."
                } else if (!String(formData.get("dose") ?? "").trim()) {
                  error = "Enter the dose."
                } else if (!Number.isInteger(quantity) || quantity <= 0) {
                  error = "Quantity must be a positive whole number."
                } else if (!String(formData.get("quantity_unit") ?? "").trim()) {
                  error = "Enter the quantity unit, such as tablets or capsules."
                } else if (
                  timeSlots.length === 0 ||
                  timeSlots.some((time) => !validTimeSlots.has(String(time)))
                ) {
                  error = "Choose at least one valid time of day."
                } else if (new Set(timeSlots).size !== timeSlots.length) {
                  error = "Each time of day can only be selected once."
                }

                setClientError(error)
                if (error) {
                  event.preventDefault()
                } else {
                  setClientError("")
                  setServerErrorDismissed(false)
                }
              }}
            >
              {(clientError || (formState.error && !serverErrorDismissed)) && (
                <p
                  role="alert"
                  className="mb-5 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive"
                >
                  {clientError || formState.error}
                </p>
              )}
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <label
                    htmlFor="patient_id"
                    className="w-24 text-sm font-medium text-foreground"
                  >
                    Patient:
                  </label>
                  <Select name="patient_id" required>
                    <SelectTrigger id="patient_id" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-primary focus:outline-none">
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
                    htmlFor="medicine_id"
                    className="w-24 text-sm font-medium text-foreground"
                  >
                    Medication:
                  </label>
                  <Select name="medicine_id" required>
                    <SelectTrigger id="medicine_id" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-primary focus:outline-none">
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
                    required
                    maxLength={200}
                    aria-label="Dose"
                    className="rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-primary focus:outline-none"
                  />
                </div>
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
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
                      type="number"
                      min="1"
                      step="1"
                      inputMode="numeric"
                      required
                      className="rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label
                      htmlFor="quantity_unit"
                      className="w-24 text-sm font-medium text-foreground"
                    >
                      Quantity unit:
                    </label>
                    <Input
                      id="quantity_unit"
                      name="quantity_unit"
                      type="text"
                      required
                      maxLength={40}
                      className="rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="timeComboBox" className="text-sm font-medium text-foreground">Time of day:</label>
                  <Combobox
                    multiple
                    autoHighlight
                    items={timeOptions}
                    value={selectedTimes}
                    onValueChange={(value) => setSelectedTimes(value as string[])}
                  >
                    <ComboboxChips id="timeComboBox" className="rounded-md border border-border bg-background px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-primary">
                      <ComboboxValue>
                        {(values) => (
                          <React.Fragment>
                            {values.map((value: string) => (
                              <ComboboxChip key={value}>{value}</ComboboxChip>
                            ))}
                            <ComboboxInput id="timeComboBox" aria-label="Time of day" className="h-8 w-full border-0 bg-transparent px-1 text-sm ring-0 focus:ring-0 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50" />
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
                  {selectedTimes.map((time) => (
                    <input key={time} type="hidden" name="timeComboBox" value={time} />
                  ))}
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <div className="flex gap-2">
              <button
                form="create-medication-form"
                type="submit"
                disabled={isPending}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:outline-none"
              >
                {isPending ? "Saving…" : "Create Record"}
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
