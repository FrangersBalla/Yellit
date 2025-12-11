import {setGlobalOptions} from "firebase-functions";
import {onDocumentCreated} from "firebase-functions/firestore";
import * as admin from "firebase-admin";
import * as logger from "firebase-functions/logger";

// Initialize Firebase Admin
admin.initializeApp();

setGlobalOptions({ maxInstances: 10 });

setGlobalOptions({ maxInstances: 10 });

// Function triggered when a new notification is created in Firestore
export const onNotificationCreated = onDocumentCreated('notifications/{notificationId}', async (event) => {
  const notification = event.data?.data();
  if (!notification) return;

  try {
    // Get user token from userTokens collection
    const userTokenDoc = await admin.firestore()
      .collection('userTokens')
      .doc(notification.to)
      .get();

    if (!userTokenDoc.exists) {
      logger.info('No token found for user:', notification.to);
      return;
    }

    const userToken = userTokenDoc.data()?.token;
    if (!userToken) {
      logger.info('No token in user document');
      return;
    }

    // Send notification
    const message = {
      token: userToken,
      notification: {
        title: 'Yellit',
        body: `${notification.from} ${notification.action}`
      },
      webpush: {
        fcmOptions: {
          link: `https://webappsocial-50f9e.web.app/post/${notification.postId}`
        }
      }
    };

    const result = await admin.messaging().send(message);
    logger.info('Notification sent to user:', notification.to, result);

  } catch (error) {
    logger.error('Error sending notification:', error);
  }
});
