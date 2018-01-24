import PushNotification from 'react-native-push-notification';
import { PushNotificationIOS } from 'react-native';

export const init = (onNotificationCallback) => {
    PushNotification.configure({
        onNotification: (notification) => {
            onNotificationCallback(notification);
            notification.finish(PushNotificationIOS.FetchResult.NoData);
        },
        permissions: {
          alert: true,
          badge: true,
          sound: true
        },
      });
};

export const scheduleNotification = (message, date) => {
    PushNotification.localNotificationSchedule({ message, date });
};
