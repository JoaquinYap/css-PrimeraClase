import Link from "next/link";
import { barbers, services } from "@/lib/data";
import { formatPrice } from "@/lib/format";

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4">
      <section className="py-16 sm:py-24">
        <p className="text-sm font-medium uppercase tracking-widest text-amber-400">
          Barbería de barrio, turnos online
        </p>
        <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          Tu próximo corte, a un par de clics.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-zinc-400">
          Elegí el servicio, tu barbero y el horario que te quede cómodo. Sin
          llamadas ni esperas.
        </p>
        <Link
          href="/reservar"
          className="mt-8 inline-block rounded-full bg-amber-400 px-6 py-3 font-semibold text-zinc-950 transition-colors hover:bg-amber-300"
        >
          Reservar turno
        </Link>
      </section>

      <section className="pb-16">
        <h2 className="text-2xl font-semibold tracking-tight">Servicios</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {services.map((service) => (
            <li key={service.id}>
              <Link
                href={`/reservar?servicio=${service.id}`}
                className="flex h-full items-start justify-between gap-4 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 transition-colors hover:border-amber-400"
              >
                <div>
                  <h3 className="font-semibold">{service.name}</h3>
                  <p className="mt-1 text-sm text-zinc-400">{service.description}</p>
                  <p className="mt-3 text-sm text-zinc-500">{service.durationMin} min</p>
                </div>
                <p className="shrink-0 font-semibold text-amber-400">
                  {formatPrice(service.price)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="pb-20">
        <h2 className="text-2xl font-semibold tracking-tight">El equipo</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-3">
          {barbers.map((barber) => (
            <li key={barber.id} className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <div className="flex size-12 items-center justify-center rounded-full bg-amber-400 text-lg font-semibold text-zinc-950">
                {barber.name[0]}
              </div>
              <h3 className="mt-4 font-semibold">{barber.name}</h3>
              <p className="mt-1 text-sm text-zinc-400">{barber.specialty}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
