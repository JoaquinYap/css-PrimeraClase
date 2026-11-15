// Almacén de reservas. Por ahora guarda en localStorage (solo en este
// navegador); en el siguiente paso se reemplaza por la base de datos.

export type Booking = {
  id: string;
  serviceId: string;
  barberId: string;
  /** Día local en formato "YYYY-MM-DD". */
  date: string;
  /** Minutos desde la medianoche. */
  start: number;
  end: number;
  customerName: string;
};

const KEY = "barberia.bookings.v1";
const EMPTY: Booking[] = [];

let cache: Booking[] | null = null;
const listeners = new Set<() => void>();

function read(): Booking[] {
  if (cache) return cache;
  try {
    const raw = window.localStorage.getItem(KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : null;
    cache = Array.isArray(parsed) ? (parsed as Booking[]) : EMPTY;
  } catch {
    cache = EMPTY;
  }
  return cache;
}

function write(next: Booking[]) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Sin almacenamiento (modo privado, etc.): queda solo en memoria.
  }
  listeners.forEach((listener) => listener());
}

export const bookingsStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  getSnapshot: read,
  getServerSnapshot: () => EMPTY,
  add(booking: Omit<Booking, "id">): Booking {
    const created = { ...booking, id: crypto.randomUUID() };
    write([...read(), created]);
    return created;
  },
  remove(id: string) {
    write(read().filter((b) => b.id !== id));
  },
};
