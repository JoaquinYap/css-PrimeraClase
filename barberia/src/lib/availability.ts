/** Intervalo de tiempo en minutos desde la medianoche: [start, end). */
export type Interval = { start: number; end: number };

export function overlaps(a: Interval, b: Interval): boolean {
  return a.start < b.end && b.start < a.end;
}

type SlotOptions = {
  /** Apertura y cierre del día, en minutos desde la medianoche. */
  open: number;
  close: number;
  /** Duración del servicio en minutos. */
  duration: number;
  /** Turnos ya ocupados de ese barbero en ese día. */
  busy: Interval[];
  /** Cada cuántos minutos puede empezar un turno. */
  step?: number;
  /** No ofrecer turnos que empiecen antes de este minuto (para "hoy"). */
  notBefore?: number;
};

/**
 * Devuelve los horarios de inicio disponibles: el turno tiene que entrar
 * completo dentro del horario de atención y no pisarse con ninguno ocupado.
 */
export function getAvailableSlots({
  open,
  close,
  duration,
  busy,
  step = 30,
  notBefore = 0,
}: SlotOptions): number[] {
  if (duration <= 0 || step <= 0) return [];

  const slots: number[] = [];
  for (let start = open; start + duration <= close; start += step) {
    if (start < notBefore) continue;
    const candidate = { start, end: start + duration };
    if (!busy.some((b) => overlaps(candidate, b))) slots.push(start);
  }
  return slots;
}
