# Barbería El Filo — plataforma de reservas

Proyecto de portafolio: una web para reservar turnos en una barbería.

## Qué hace hoy

- Página de inicio con servicios, precios y el equipo.
- Reserva en cuatro pasos: servicio, barbero, día y horario.
- Solo ofrece horarios realmente libres: el turno tiene que entrar completo
  en el horario de atención y no pisarse con otro del mismo barbero.
- "Mis reservas", con opción de cancelar.

Por ahora las reservas se guardan en el navegador (`localStorage`). El
siguiente paso es moverlas a una base de datos con cuentas de usuario.

## Tecnologías

Next.js (App Router) · TypeScript · Tailwind CSS · Vitest

## Cómo correrlo

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # tests de la lógica de disponibilidad
npm run build    # build de producción
```

## Estructura

```
src/app/                  páginas (inicio y /reservar)
src/components/           formulario de reserva
src/lib/availability.ts   cálculo de horarios libres (con tests)
src/lib/bookings-store.ts almacén de reservas
src/lib/data.ts           servicios, barberos y horarios de atención
```

## Próximos pasos

- [ ] Base de datos y login (Supabase)
- [ ] Bloqueo de dobles reservas en la base de datos
- [ ] Panel de administración
- [ ] Correo de confirmación
