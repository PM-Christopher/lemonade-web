// firebase-messaging-sw.js
importScripts(
    "https://www.gstatic.com/firebasejs/10.11.1/firebase-app-compat.js"
);
importScripts(
    "https://www.gstatic.com/firebasejs/10.11.1/firebase-messaging-compat.js"
);

const firebaseConfig = {
    apiKey: "AIzaSyBZrXzFrxy7xL8mWkyd3TzGYo5zWnIlQb8",
    authDomain: "techlemonade-f18f7.firebaseapp.com",
    projectId: "techlemonade-f18f7",
    storageBucket: "techlemonade-f18f7.firebasestorage.app",
    appId: "1:224847211636:web:8b9fa4842f15cdd327b521",
    messagingSenderId: "224847211636",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body:
        payload.notification.body,
        icon: payload.notification.icon,
        data: { url: payload.fcmOptions?.link || "/" },
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const targetUrl = event.notification.data?.url || "/";

    event.waitUntil(
        clients
            .matchAll({
                type: "window",
                includeUncontrolled: true,
            })
            .then((clientList) => {
                for (const client of clientList) {
                    if (client.url.includes(targetUrl) && "focus" in client) {
                        return client.focus();
                    }
                }
                return clients.openWindow(targetUrl);
            })
    );
});