import * as Sentry from "@sentry/vue";
import { browserTracingIntegration } from "@sentry/browser"; 
import { boot } from "quasar/wrappers";

export default boot(({ app }) => {
  Sentry.init({
    app,
    dsn: import.meta.env.VITE_SENTRY_DSN, // 🔥 Asegura que la variable está bien definida
    integrations: [browserTracingIntegration()],
    tracesSampleRate: 1.0, // Ajusta según necesidad
  });
});