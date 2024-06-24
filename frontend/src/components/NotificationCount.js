import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NotificationCount = ({ userId }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      const response = await axios.get(`/notifications/unread-count?userId=${userId}`);
      setCount(response.data.unreadCount);
    };
    fetchUnreadCount();
  }, [userId]);

  return <div>Unread Notifications: {count}</div>;
};

export default NotificationCount;
