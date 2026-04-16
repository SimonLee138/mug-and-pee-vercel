import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getMedicines } from "@/lib/actions"
import { PencilLine, Plus } from "lucide-react"
import Link from "next/link"

export default async function Page() {
  const medicines = await getMedicines()
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 bg-background px-6 py-8">
      <section className="flex space-y-4 rounded-3xl border border-border bg-card/90 p-6 shadow-sm">
        <div className="flex grow flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium tracking-[0.3em] text-muted-foreground uppercase">
              Medicines
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Medicine list
            </h1>
          </div>
        </div>
      </section>

      <div className="flex w-full items-center justify-end">
        <Link
          href="/medications/create"
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
