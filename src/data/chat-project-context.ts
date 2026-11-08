import type { Locale } from "@/i18n/config";

export function getProjectContext(locale: Locale): string {
  if (locale === "en") {
    return `Verified portfolio project context:

ObstetriCare
- An early-warning system for preterm birth prevention in maternal-child health.
- Frontend: React 19, TypeScript, Vite, Tailwind CSS, and Recharts dashboards.
- Backend: FastAPI with async endpoints, PostgreSQL 16, SQLAlchemy 2.0 async, Asyncpg, Alembic migrations, Redis, and role-based JWT authentication.
- It supports medical scheduling, patient and smart-record management, clinical dashboards, PDF/Excel reports, and physician feedback on models.
- Its S-2 stage combines Random Forest, CatBoost, and SVM in a weighted consensus over 10 clinical variables to estimate preterm-birth risk.
- S-3 combines ordinal logistic regression, a decision tree, and a weighted score to classify urgency as green, yellow, orange, or red.
- S-4 creates clinical recommendation categories with Gemini 2.0 Flash and falls back to deterministic IF-THEN rules when the AI service is unavailable.
- This is a support system: it does not replace clinical judgment or provide patient-specific medical advice.

Amará
- A bilingual Spanish/English emotional-wellness platform built with Next.js 16 App Router, React 19, TypeScript, and Tailwind CSS 4.
- Supabase provides authentication, PostgreSQL persistence, row-level security, and versioned SQL migrations. Sensitive API routes require authentication.
- It includes emotional tracking with a calendar, heat map, and statistics; a conversational assistant with persistent history and contextual recommendations; a moderated social area; music via YouTube; exercises; and a wellness-product catalog.
- The assistant can use a user's own recent emotion records and the real catalog only after the user is authenticated in Amará. JeffBot has no access to those records.

When comparing the projects, explain the engineering decisions and their tradeoffs precisely. Do not claim deployment status, performance metrics, integrations, or features beyond this context.`;
  }

  return `Contexto verificado de los proyectos del portafolio:

ObstetriCare
- Sistema de alerta temprana para la prevención de parto prematuro en salud materno-infantil.
- Frontend: React 19, TypeScript, Vite, Tailwind CSS y dashboards con Recharts.
- Backend: FastAPI con endpoints asíncronos, PostgreSQL 16, SQLAlchemy 2.0 async, Asyncpg, migraciones Alembic, Redis y autenticación JWT por roles.
- Incluye agenda médica, gestión de pacientes y expediente inteligente, dashboards clínicos, reportes PDF/Excel y feedback médico sobre los modelos.
- La etapa S-2 combina Random Forest, CatBoost y SVM en un consenso ponderado de 10 variables clínicas para estimar el riesgo de parto prematuro.
- S-3 combina regresión logística ordinal, árbol de decisión y puntaje ponderado para clasificar la urgencia como VERDE, AMARILLO, NARANJA o ROJO.
- S-4 produce categorías de recomendación clínica con Gemini 2.0 Flash y usa reglas determinísticas IF-THEN si el servicio de IA no está disponible.
- Es un sistema de apoyo: no sustituye el juicio clínico ni entrega consejos médicos para pacientes concretos.

Amará
- Plataforma bilingüe de bienestar emocional construida con Next.js 16 App Router, React 19, TypeScript y Tailwind CSS 4.
- Supabase provee autenticación, persistencia PostgreSQL, seguridad a nivel de fila y migraciones SQL versionadas. Las rutas sensibles exigen autenticación.
- Incluye seguimiento emocional con calendario, mapa de calor y estadísticas; asistente conversacional con historial persistente y recomendaciones contextuales; espacio social moderado; música mediante YouTube; ejercicios y catálogo de productos de bienestar.
- El asistente de Amará puede usar registros emocionales recientes y el catálogo real solo después de autenticar al usuario. JeffBot no tiene acceso a esos registros.

Al comparar los proyectos, explica con precisión las decisiones de ingeniería y sus compromisos. No afirmes despliegues, métricas de rendimiento, integraciones o funciones que no aparezcan en este contexto.`;
}
