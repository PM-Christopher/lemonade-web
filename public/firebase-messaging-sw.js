// // firebase-messaging-sw.js
// importScripts(
//     "https://www.gstatic.com/firebasejs/10.11.1/firebase-app-compat.js"
// );
// importScripts(
//     "https://www.gstatic.com/firebasejs/10.11.1/firebase-messaging-compat.js"
// );
//
// const firebaseConfig = {
//     apiKey: "AIzaSyD9WtljUS7N_nJ938zTmqZV8zk7BL65hIk",
//     authDomain: "the-lemonade-app.firebaseapp.com",
//     projectId: "the-lemonade-app",
//     storageBucket: "the-lemonade-app.firebasestorage.app",
//     messagingSenderId: "1094738326830",
//     appId: "1:1094738326830:web:e3e62c1c254694f310f6bf",
//     measurementId: "G-7Z2HW30FLK"
// };
//
// firebase.initializeApp(firebaseConfig);
//
// const messaging = firebase.messaging();
//
// messaging.onBackgroundMessage((payload) => {
//     const notificationTitle = payload.notification.title;
//     const notificationOptions = {
//         body:
//         payload.notification.body,
//         icon: payload.notification.icon,
//         data: { url: payload.fcmOptions?.link || "/" },
//     };
//
//     self.registration.showNotification(notificationTitle, notificationOptions);
// });
//
// self.addEventListener("notificationclick", (event) => {
//     event.notification.close();
//     const targetUrl = event.notification.data?.url || "/";
//
//     event.waitUntil(
//         clients
//             .matchAll({
//                 type: "window",
//                 includeUncontrolled: true,
//             })
//             .then((clientList) => {
//                 for (const client of clientList) {
//                     if (client.url.includes(targetUrl) && "focus" in client) {
//                         return client.focus();
//                     }
//                 }
//                 return clients.openWindow(targetUrl);
//             })
//     );
// });

importScripts('https://www.gstatic.com/firebasejs/9.10.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.10.0/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyD9WtljUS7N_nJ938zTmqZV8zk7BL65hIk",
    authDomain: "the-lemonade-app.firebaseapp.com",
    projectId: "the-lemonade-app",
    storageBucket: "the-lemonade-app.firebasestorage.app",
    messagingSenderId: "1094738326830",
    appId: "1:1094738326830:web:e3e62c1c254694f310f6bf",
    measurementId: "G-7Z2HW30FLK"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('Received background message: ', payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = { body: payload.notification.body };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
