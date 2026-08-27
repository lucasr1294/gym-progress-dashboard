# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Lucas, tracking his own gym workouts. It's a personal tool — not built for other people, even though the data model supports a login per name.

## Product Purpose

A personal gym progress tracker: log workouts (sets, reps, weight per exercise), browse exercises by category, and see progress over time (personal bests, charts). Success is simply that logging a workout and checking progress stays fast and reliable for daily/weekly gym use.

## Operating Context

- Login is name-only (sets a `userId` cookie, no password) — acceptable because this is a personal tool, not a security boundary.
- Three main views: Dashboard (summary), Ejercicios (browse/add/edit/delete exercises, log progress per exercise), Progreso (charts: strength trends, category distribution).
- Data lives in Google Sheets: one spreadsheet with two tabs per user, `{userId}Exercises` and `{userId}Progress`, read/written via the `google-spreadsheet` library.
- Workouts are typically logged from a phone, standing at the gym, between sets.

## Capabilities and Constraints

- **Backend must stay Google Sheets** (per-user sheet tabs) — confirmed constraint, do not migrate to another database.
- **Interface must stay in Spanish** — confirmed constraint. The codebase currently mixes English strings (e.g. some form labels, dialog titles) with Spanish; new/touched copy should move toward Spanish, but this is legacy debt, not something to mass-rewrite unprompted.
- No real authentication/authorization model exists or is planned — single user today.
- The Exercises sheet schema is fixed (`id, name, category, lastWeight, personalBest, unit`); the Progress sheet caps at 4 sets per logged workout (`set1..set4`) in the current schema — any change here is a deliberate schema migration, not a casual edit.

## Brand Commitments

The app has an informal internal name, "Luxor" (appears once, in the dashboard's welcome dialog), but there's no branding ambition attached to it — this is a personal-utility project, not a project aiming for polished identity/visual work.

## Evidence on Hand

None (no testimonials, case studies, or marketing assets — not applicable to a personal tool).

## Product Principles

1. Personal utility over decoration — the visual system should make the data legible and the logging fast. Deliberate, well-crafted design is in scope; ornament, marketing polish and brand-building are not.
2. Google Sheets is the persistence layer, per-user tabs — never introduce a different datastore.
3. Spanish-first interface — the target state is Spanish; existing English strings are legacy, not intentional.
4. Low-friction mobile logging — the exercise/progress-logging flows happen on a phone mid-workout, so speed and minimal taps matter more than information density. Two surfaces, two modes. Ejercicios / logging = Operate: phone, one hand, between sets, minimum taps, large targets. Progreso = Read: density and comparison are the point; don't simplify the charts for the sake of calm.
5. Single active user today on a multi-user-capable data model — don't break the per-user sheet architecture even though only one person currently uses it.

## Anti-references

Purple/blue gradients. Glassmorphism. Cards nested in cards. Italic serif display type. Achievement badges, streaks, confetti, motivational copy ("¡Vamos!", "Nuevo récord 🔥"). Hero sections and CTAs — there is nothing to sell here. Icon tiles above every heading. Inter as the default answer to everything.