if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then((e) => {
        console.log('Service worker registered', e)
      })
      .catch(error => {
        console.error('Error registering service worker:', error)
    })
}
