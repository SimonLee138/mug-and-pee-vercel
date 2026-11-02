import Image from "next/image"

const cats = [
  {
    name: "Muggle",
    image: "/muggle.JPEG",
    description: "One of the very important patients behind this care tracker.",
  },
  {
    name: "Peeves",
    image: "/peeves.JPEG",
    description: "A beloved member of the family, and a good reason to stay organized.",
  },
]

export default function CatsPage() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-background px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <header className="space-y-3">
          <p className="text-xs font-semibold tracking-[0.24em] text-primary uppercase sm:text-sm">
            The patients
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Meet the cats
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground">
            The best part of keeping their care on schedule.
          </p>
        </header>

        <section aria-label="Cat photos" className="grid gap-5 sm:grid-cols-2 sm:gap-6">
          {cats.map((cat) => (
            <article
              key={cat.name}
              className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm"
            >
              <div className="relative aspect-[4/3] w-full bg-muted">
                <Image
                  src={cat.image}
                  alt={`${cat.name}, one of the cats cared for with this tracker`}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="space-y-2 p-5 sm:p-6">
                <h2 className="text-xl font-semibold text-foreground">{cat.name}</h2>
                <p className="text-sm leading-6 text-muted-foreground">{cat.description}</p>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}