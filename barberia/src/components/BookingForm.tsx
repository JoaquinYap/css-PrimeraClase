"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { getAvailableSlots } from "@/lib/availability";
import { bookingsStore, type Booking } from "@/lib/bookings-store";
import { barbers, openingHours, services } from "@/lib/data";
import { formatDateLong, formatPrice, formatTime, toDateKey } from "@/lib/format";

const DAYS_AHEAD = 14;

const noopSubscribe = () => () => {};

/** `false` en el servidor y en la hidratación, `true` ya en el navegador. */
function useIsClient() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

export default function BookingForm({ initialServiceId }: { initialServiceId: string }) {
  // Las fechas y las reservas dependen del navegador (hora local y
  // localStorage), así que el formulario se dibuja recién en el cliente.
  const isClient = useIsClient();
  if (!isClient) {
    return <p className="mt-10 text-zinc-500">Cargando turnos…</p>;
  }
  return <BookingFormInner initialServiceId={initialServiceId} />;
}

function BookingFormInner({ initialServiceId }: { initialServiceId: string }) {
  const bookings = useSyncExternalStore(
    bookingsStore.subscribe,
    bookingsStore.getSnapshot,
    bookingsStore.getServerSnapshot,
  );

  const [now] = useState(() => new Date());
  const days = useMemo(() => {
    return Array.from({ length: DAYS_AHEAD }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      return { key: toDateKey(date), date, hours: openingHours[date.getDay()] };
    });
  }, [now]);

  const [serviceId, setServiceId] = useState(initialServiceId);
  const [barberId, setBarberId] = useState(barbers[0].id);
  const [dateKey, setDateKey] = useState(
    () => (days.find((d) => d.hours) ?? days[0]).key,
  );
  const [slot, setSlot] = useState<number | null>(null);
  const [customerName, setCustomerName] = useState("");
  const [confirmed, setConfirmed] = useState<Booking | null>(null);

  const service = services.find((s) => s.id === serviceId) ?? services[0];
  const day = days.find((d) => d.key === dateKey) ?? days[0];
  const todayKey = days[0].key;

  const slots = useMemo(() => {
    if (!day.hours) return [];
    return getAvailableSlots({
      open: day.hours.open,
      close: day.hours.close,
      duration: service.durationMin,
      busy: bookings.filter((b) => b.barberId === barberId && b.date === day.key),
      notBefore: day.key === todayKey ? now.getHours() * 60 + now.getMinutes() : 0,
    });
  }, [day, service, bookings, barberId, todayKey, now]);

  // Si cambió el servicio, el barbero o el día, el horario elegido puede
  // haber dejado de estar disponible.
  const selectedSlot = slot !== null && slots.includes(slot) ? slot : null;
  const canConfirm = selectedSlot !== null && customerName.trim().length > 0;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (selectedSlot === null || !canConfirm) return;
    const created = bookingsStore.add({
      serviceId: service.id,
      barberId,
      date: day.key,
      start: selectedSlot,
      end: selectedSlot + service.durationMin,
      customerName: customerName.trim(),
    });
    setConfirmed(created);
    setSlot(null);
  }

  const upcoming = [...bookings]
    .filter((b) => b.date >= todayKey)
    .sort((a, b) => a.date.localeCompare(b.date) || a.start - b.start);

  return (
    <>
      <form onSubmit={handleSubmit} className="mt-10 space-y-10">
        <Step number={1} title="Servicio">
          <div className="grid gap-3 sm:grid-cols-2">
            {services.map((s) => (
              <Option
                key={s.id}
                selected={s.id === serviceId}
                onClick={() => setServiceId(s.id)}
              >
                <span className="font-medium">{s.name}</span>
                <span className="text-sm opacity-70">
                  {s.durationMin} min · {formatPrice(s.price)}
                </span>
              </Option>
            ))}
          </div>
        </Step>

        <Step number={2} title="Barbero">
          <div className="grid gap-3 sm:grid-cols-3">
            {barbers.map((b) => (
              <Option
                key={b.id}
                selected={b.id === barberId}
                onClick={() => setBarberId(b.id)}
              >
                <span className="font-medium">{b.name}</span>
                <span className="text-sm opacity-70">{b.specialty}</span>
              </Option>
            ))}
          </div>
        </Step>

        <Step number={3} title="Día">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {days.map((d) => (
              <button
                key={d.key}
                type="button"
                disabled={!d.hours}
                aria-pressed={d.key === dateKey}
                onClick={() => setDateKey(d.key)}
                className={`flex w-16 shrink-0 flex-col items-center rounded-xl border px-2 py-3 transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
                  d.key === dateKey
                    ? "border-amber-400 bg-amber-400 text-zinc-950"
                    : "border-zinc-800 bg-zinc-900 enabled:hover:border-zinc-600"
                }`}
              >
                <span className="text-xs uppercase">
                  {d.date.toLocaleDateString("es-AR", { weekday: "short" })}
                </span>
                <span className="text-xl font-semibold">{d.date.getDate()}</span>
              </button>
            ))}
          </div>
        </Step>

        <Step number={4} title="Horario">
          {slots.length === 0 ? (
            <p className="text-zinc-400">
              No quedan turnos para este día. Probá con otro día u otro barbero.
            </p>
          ) : (
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
              {slots.map((s) => (
                <button
                  key={s}
                  type="button"
                  aria-pressed={s === selectedSlot}
                  onClick={() => setSlot(s)}
                  className={`rounded-lg border py-2 text-sm font-medium tabular-nums transition-colors ${
                    s === selectedSlot
                      ? "border-amber-400 bg-amber-400 text-zinc-950"
                      : "border-zinc-800 bg-zinc-900 hover:border-zinc-600"
                  }`}
                >
                  {formatTime(s)}
                </button>
              ))}
            </div>
          )}
        </Step>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
          <label htmlFor="customer-name" className="text-sm font-medium">
            Tu nombre
          </label>
          <input
            id="customer-name"
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            autoComplete="name"
            maxLength={60}
            className="mt-2 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 outline-none focus:border-amber-400"
          />
          <p className="mt-4 text-sm text-zinc-400">
            {selectedSlot === null
              ? "Elegí un horario para continuar."
              : `${service.name} con ${barbers.find((b) => b.id === barberId)?.name}, ${formatDateLong(day.key)} a las ${formatTime(selectedSlot)} · ${formatPrice(service.price)}`}
          </p>
          <button
            type="submit"
            disabled={!canConfirm}
            className="mt-4 w-full rounded-full bg-amber-400 px-6 py-3 font-semibold text-zinc-950 transition-colors hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Confirmar reserva
          </button>
        </div>
      </form>

      {confirmed && (
        <p
          role="status"
          className="mt-6 rounded-xl border border-emerald-700 bg-emerald-950 p-4 text-emerald-200"
        >
          ¡Listo, {confirmed.customerName}! Tu turno quedó reservado para el{" "}
          {formatDateLong(confirmed.date)} a las {formatTime(confirmed.start)}.
        </p>
      )}

      <section className="mt-12">
        <h2 className="text-xl font-semibold tracking-tight">Mis reservas</h2>
        {upcoming.length === 0 ? (
          <p className="mt-3 text-zinc-400">Todavía no tenés turnos reservados.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {upcoming.map((b) => (
              <li
                key={b.id}
                className="flex items-center justify-between gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4"
              >
                <div>
                  <p className="font-medium">
                    {services.find((s) => s.id === b.serviceId)?.name} con{" "}
                    {barbers.find((x) => x.id === b.barberId)?.name}
                  </p>
                  <p className="text-sm text-zinc-400">
                    {formatDateLong(b.date)} · {formatTime(b.start)}–{formatTime(b.end)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    bookingsStore.remove(b.id);
                    if (confirmed?.id === b.id) setConfirmed(null);
                  }}
                  className="shrink-0 rounded-full border border-zinc-700 px-3 py-1.5 text-sm transition-colors hover:border-red-500 hover:text-red-400"
                >
                  Cancelar
                </button>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 text-xs text-zinc-500">
          Por ahora las reservas se guardan solo en este navegador.
        </p>
      </section>
    </>
  );
}

function Step({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-4 flex items-center gap-3 text-lg font-semibold">
        <span className="flex size-7 items-center justify-center rounded-full bg-zinc-800 text-sm text-amber-400">
          {number}
        </span>
        {title}
      </legend>
      {children}
    </fieldset>
  );
}

function Option({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition-colors ${
        selected
          ? "border-amber-400 bg-amber-400 text-zinc-950"
          : "border-zinc-800 bg-zinc-900 hover:border-zinc-600"
      }`}
    >
      {children}
    </button>
  );
}
