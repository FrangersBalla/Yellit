/* <reference lib="webworker" />
import { precacheAndRoute } from 'workbox-precaching'

declare const self: ServiceWorkerGlobalScope

// Workbox precaching (per la PWA) - modifica fatta per sw
precacheAndRoute(self.__WB_MANIFEST)

// Firebase Messaging - modifica fatta per sw
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js')

// @ts-ignore
firebase.initializeApp({
  apiKey: "AIzaSyDNQt6WeJH58q_DtGUFFgFtNFWW7h174G4",
  authDomain: "webappsocial-50f9e.firebaseapp.com",
  projectId: "webappsocial-50f9e",
  storageBucket: "webappsocial-50f9e.firebasestorage.app",
  messagingSenderId: "265051454057",
  appId: "1:265051454057:web:68e594d026a10d8c8400f8"
})

// @ts-ignore
const messaging = firebase.messaging()

// Notifiche push in background - modifica fatta per sw
messaging.onBackgroundMessage((payload: any) => {
  console.log('Push ricevuta:', payload)

  const notificationTitle = payload.notification?.title || 'Nuova notifica'
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/android/android-launchericon-192-192.png',
    badge: '/android/android-launchericon-96-96.png',
    data: payload.data
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})*/