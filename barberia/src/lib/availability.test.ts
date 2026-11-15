import { describe, expect, it } from "vitest";
import { getAvailableSlots, overlaps } from "./availability";

const h = (hours: number, minutes = 0) => hours * 60 + minutes;

describe("overlaps", () => {
  it("detecta turnos que se pisan", () => {
    expect(overlaps({ start: h(10), end: h(11) }, { start: h(10, 30), end: h(11, 30) })).toBe(true);
  });

  it("no considera pisados dos turnos consecutivos", () => {
    expect(overlaps({ start: h(10), end: h(10, 30) }, { start: h(10, 30), end: h(11) })).toBe(false);
  });
});

describe("getAvailableSlots", () => {
  it("ofrece todos los turnos de un día vacío", () => {
    const slots = getAvailableSlots({ open: h(10), close: h(12), duration: 30, busy: [] });
    expect(slots).toEqual([h(10), h(10, 30), h(11), h(11, 30)]);
  });

  it("no ofrece turnos que terminan después del cierre", () => {
    const slots = getAvailableSlots({ open: h(10), close: h(12), duration: 60, busy: [] });
    expect(slots).toEqual([h(10), h(10, 30), h(11)]);
  });

  it("excluye los horarios ocupados", () => {
    const slots = getAvailableSlots({
      open: h(10),
      close: h(12),
      duration: 30,
      busy: [{ start: h(10, 30), end: h(11) }],
    });
    expect(slots).toEqual([h(10), h(11), h(11, 30)]);
  });

  it("un servicio largo no entra en un hueco corto", () => {
    const slots = getAvailableSlots({
      open: h(10),
      close: h(12),
      duration: 60,
      busy: [{ start: h(10, 30), end: h(11) }],
    });
    expect(slots).toEqual([h(11)]);
  });

  it("no ofrece turnos que ya pasaron", () => {
    const slots = getAvailableSlots({
      open: h(10),
      close: h(12),
      duration: 30,
      busy: [],
      notBefore: h(10, 45),
    });
    expect(slots).toEqual([h(11), h(11, 30)]);
  });

  it("devuelve vacío si el servicio no entra en el día", () => {
    expect(getAvailableSlots({ open: h(10), close: h(10, 30), duration: 60, busy: [] })).toEqual([]);
  });
});
