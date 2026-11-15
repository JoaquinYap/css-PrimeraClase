// Datos del negocio. Por ahora viven en el código; en el siguiente paso
// se mueven a la base de datos (Supabase).

export type Service = {
  id: string;
  name: string;
  description: string;
  durationMin: number;
  price: number;
};

export type Barber = {
  id: string;
  name: string;
  specialty: string;
};

export const BUSINESS_NAME = "Barbería El Filo";

export const services: Service[] = [
  {
    id: "corte",
    name: "Corte clásico",
    description: "Corte a tijera o máquina, lavado y peinado.",
    durationMin: 30,
    price: 12000,
  },
  {
    id: "barba",
    name: "Arreglo de barba",
    description: "Perfilado, rebaje y toalla caliente.",
    durationMin: 30,
    price: 8000,
  },
  {
    id: "corte-barba",
    name: "Corte + barba",
    description: "El servicio completo, sin apuro.",
    durationMin: 60,
    price: 18000,
  },
  {
    id: "ninos",
    name: "Corte niños",
    description: "Para menores de 12 años.",
    durationMin: 30,
    price: 9000,
  },
];

export const barbers: Barber[] = [
  { id: "mateo", name: "Mateo", specialty: "Degradados y fades" },
  { id: "lucas", name: "Lucas", specialty: "Tijera y cortes clásicos" },
  { id: "bruno", name: "Bruno", specialty: "Barbas y afeitado" },
];

/**
 * Horario de atención por día de la semana (0 = domingo … 6 = sábado),
 * en minutos desde la medianoche. `null` significa cerrado.
 */
export const openingHours: Record<number, { open: number; close: number } | null> = {
  0: null,
  1: { open: 10 * 60, close: 19 * 60 },
  2: { open: 10 * 60, close: 19 * 60 },
  3: { open: 10 * 60, close: 19 * 60 },
  4: { open: 10 * 60, close: 19 * 60 },
  5: { open: 10 * 60, close: 20 * 60 },
  6: { open: 10 * 60, close: 14 * 60 },
};
