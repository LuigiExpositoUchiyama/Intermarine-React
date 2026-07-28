let nextId = 6;

let notifications = [
  {
    id: 1,
    title: 'Embarcações atrasadas',
    description: '2 embarcações da sua área estão atrasadas.',
    time: 'Há 5 min',
    icon: 'person_alert',
    type: 'danger',
    read: false,
  },
  {
    id: 2,
    title: 'Embarcações em atenção',
    description: '3 embarcações da sua área precisam de atenção.',
    time: 'Há 15 min',
    icon: 'warning_amber',
    type: 'warning',
    read: false,
  },
  {
    id: 3,
    title: 'Pendências produtivas',
    description: '5 pendências produtivas aguardando resolução.',
    time: 'Há 25 min',
    icon: 'assignment_late',
    type: 'pending',
    read: false,
  },
  {
    id: 4,
    title: 'Retrabalhos',
    description: '2 retrabalhos registrados na sua área.',
    time: 'Há 40 min',
    icon: 'settings_suggest',
    type: 'rework',
    read: false,
  },
  {
    id: 5,
    title: 'Reprocessos',
    description: '1 reprocesso em andamento na sua área.',
    time: 'Há 55 min',
    icon: 'sync',
    type: 'reprocess',
    read: false,
  },
];

function cloneNotifications() {
  return notifications.map((notification) => ({
    ...notification,
  }));
}

function getNotifications() {
  return cloneNotifications();
}

function getUnreadCount() {
  return notifications.filter((notification) => !notification.read).length;
}

function markAsRead(id) {
  notifications = notifications.map((notification) =>
    notification.id === Number(id)
      ? {
          ...notification,
          read: true,
        }
      : notification,
  );

  return cloneNotifications();
}

function markAllAsRead() {
  notifications = notifications.map((notification) => ({
    ...notification,
    read: true,
  }));

  return cloneNotifications();
}

function addNotification(notification) {
  const newNotification = {
    ...notification,
    id: nextId++,
  };

  notifications = [newNotification, ...notifications];

  return {
    ...newNotification,
  };
}

function removeNotification(id) {
  notifications = notifications.filter(
    (notification) => notification.id !== Number(id),
  );

  return cloneNotifications();
}

function clearNotifications() {
  notifications = [];

  return [];
}

const notificationService = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  addNotification,
  removeNotification,
  clearNotifications,
};

export default notificationService;
