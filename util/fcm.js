const admin = require('firebase-admin');
const serviceAccount = require('../config/vheelocaptainflutter-firebase-adminsdk-unut4-e6878ed8ff.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // databaseURL: '<your-database-url>'
});

const sendNotification = async (registrationToken, payload) => {
    try {
        const response = await admin.messaging().send({
            token: registrationToken,
            notification: payload.notification,
            data: payload.data
        });
        console.log(`FCM notification sent: ${response}`);
    } catch (error) {
        console.error(`Error sending FCM notification: ${error}`);
    }
};

module.exports = {
    sendNotification
};
