import type { Metadata } from "next";
import { Suspense } from "react";
import BookingForm from "@/components/BookingForm";
import { services } from "@/lib/data";

export const metadata: Metadata = {
  title: "Reservar turno",
};

export default function ReservarPage({ searchParams }: PageProps<"/reservar">) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Reservá tu turno</h1>
      <p className="mt-2 text-zinc-400">Cuatro pasos y listo.</p>
      {/* El servicio preelegido llega por la URL (?servicio=...), que solo se
          conoce en cada visita: el resto de la página se sirve al instante. */}
      <Suspense fallback={<p className="mt-10 text-zinc-500">Cargando turnos…</p>}>
        <PreselectedBookingForm searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function PreselectedBookingForm({
  searchParams,
}: Pick<PageProps<"/reservar">, "searchParams">) {
  const { servicio } = await searchParams;
  const initialServiceId = services.some((s) => s.id === servicio)
    ? (servicio as string)
    : services[0].id;

  return <BookingForm initialServiceId={initialServiceId} />;
}
