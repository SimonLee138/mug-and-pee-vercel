"use client"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Medicine } from "@/lib/definitions"
import { PencilLine, Plus } from "lucide-react"
import Link from "next/link"
import * as React from "react"
import { Button } from "../ui/button"

type MedicineCard = Medicine & {
  childMedicines: Medicine[]
}

export default function MedicineCard({ medicines }: { medicines: MedicineCard[] }) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <section className="flex flex-col gap-6">
      <div className="flex w-full items-center justify-end">
        <Link
          href="/medicines/create"
          className="h-fit w-fit rounded-3xl border border-border bg-card/90 p-3 shadow-sm"
        >
          <Plus className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-6">
        {medicines.map((medicine) => (
          <Card
            id={`medicine-${medicine.id}`}
            key={medicine.id}
            className="col-span-1 md:col-span-2"
          >
            <CardHeader>
              <CardTitle>{medicine.name}</CardTitle>
              <CardDescription>{medicine.description}</CardDescription>
              <CardAction>
                <Link
                  href={`/medicines/${medicine.id}`}
                  className="text-sm hover:underline"
                >
                  <div className="h-fit w-fit rounded-3xl border border-border bg-card/90 p-3 shadow-sm">
                    <PencilLine className="h-4 w-4" />
                  </div>
                </Link>
              </CardAction>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Dose: {medicine.dose}
              </p>
              {medicine.childMedicines.length > 0 && (
                <div className="grid gap-2">
                  <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between">
                        <Button variant="outline" className="w-full mt-2">
                          {isOpen ? "Hide Contents" : "Show Contents"}
                        </Button>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      {medicine.childMedicines.length > 0 ? medicine.childMedicines.map((child) => (
                        <div key={`${medicine.id}-${child.id}`} className="rounded-md border px-4 py-2 text-sm my-2 flex justify-between">
                          <p className="font-semibold text-foreground">{child.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {child.dose}
                          </p>
                        </div>
                      )) : null}
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}