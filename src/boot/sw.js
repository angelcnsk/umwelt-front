if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/src-pwa/sw.js')
      .then(() => {
        console.log('Service worker registered')
      })
      .catch(error => {
        console.error('Error registering service worker:', error)
    })
}
