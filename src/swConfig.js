export default {
    onUpdate: registration => {
      registration.unregister().then(() => {
      window.location.reload()
    })
   },
   onSuccess: registration => {
     registration.waiting.postMessage('skipWaiting')
    },
   }