
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!('Notification' in window)) { // caso in cui browser non supporta notifiche
    return 'denied'
  }

  if (Notification.permission === 'granted') { // abilitate
    return 'granted'
  }

  if (Notification.permission === 'denied') { //disabilitate
    return 'denied'
  }

  try {
    const permission = await Notification.requestPermission() // solo se permission == ask
    return permission
  } catch (error) {
    return 'denied'
  }
}

// mando una notifica in loco per ogni nuova notifica ricevuta dall'utente
export const showNewNotificationAlert = (reg: ServiceWorkerRegistration | undefined) => {
  reg?.showNotification('Nuova notifica!', {
    body: 'Hai ricevuto una nuova notifica',
    tag: 'new-notification',
    icon: '/android/android-launchericon-192-192.png',
    badge: '/android/android-launchericon-96-96.png'
  })
}

// recupero la registrazione del service worker se le notifiche sono abilitate
export const displayNotification = () => {
  if (Notification.permission === 'granted') {
    navigator.serviceWorker.getRegistration().then(reg => {
      if (reg) {
        showNewNotificationAlert(reg)
      }
    })
  }
}