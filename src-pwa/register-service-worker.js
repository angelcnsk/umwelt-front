import { register } from 'register-service-worker'
import { Notify } from "quasar";

let waitingServiceWorker = null
// The ready(), registered(), cached(), updatefound() and updated()
// events passes a ServiceWorkerRegistration instance in their arguments.
// ServiceWorkerRegistration: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration

register(process.env.SERVICE_WORKER_FILE, {
  // The registrationOptions object will be passed as the second argument
  // to ServiceWorkerContainer.register()
  // https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/register#Parameter

  // registrationOptions: { scope: './' },

  ready (/* registration */) {
    // console.log('Service worker is active.')
  },

  registered (/* registration */) {
    // console.log('Service worker has been registered.')
  },

  cached (/* registration */) {
    // console.log('Content has been cached for offline use.')
  },

  updatefound (/* registration */) {
    // console.log('New content is downloading.')
  },

  updated (registration) {
    // console.log('New content is available; please refresh.')
    console.log('✅ Nueva versión lista para ser usada')
    waitingServiceWorker = registration

    // Forzar activación inmediata del nuevo SW
    if (waitingServiceWorker.waiting) {
      Notify.create({
        message: 'Hay una nueva versión disponible.',
        color: 'primary',
        timeout: 0, // permanece hasta que el usuario interactúe
        actions: [
          {
            label: 'Actualizar',
            color: 'white',
            handler: () => {
              // Esperar a que se active el nuevo SW y luego recargar
              waitingServiceWorker.addEventListener('statechange', (event) => {
                if (event.target.state === 'activated') {
                  window.location.reload()
                }
              })
              // Forzar que el nuevo SW se active
              waitingServiceWorker.waiting.postMessage({ type: 'SKIP_WAITING' })
            }
          },
          {
            label: 'Ignorar',
            color: 'white'
          }
        ]
      })
    }
  },

  offline () {
    // console.log('No internet connection found. App is running in offline mode.')
  },

  error (/* err */) {
    // console.error('Error during service worker registration:', err)
  }
})
