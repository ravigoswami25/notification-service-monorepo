// frontend/src/App.js
import React, { useEffect } from 'react';
import { messaging, getToken, onMessage } from './firebase';
import NotificationCount from './components/NotificationCount';
import axios from 'axios';

function App() {
  useEffect(() => {
    const requestPermission = async () => {
      try {
        await Notification.requestPermission();
        const token = await getToken(messaging, { vapidKey: 'vapid_key' });
        console.log('FCM Token:', token);
        await axios.post('/users/update-token', { token }); // Send the token to the backend to save it
      } catch (error) {
        console.error('Permission denied or error occurred:', error);
      }
    };

    requestPermission();

    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      // Customize notification handling if needed
    });
  }, []);

  return (
    <div className="App">
      <NotificationCount userId="USER_ID_HERE" />
    </div>
  );
}

export default App;
