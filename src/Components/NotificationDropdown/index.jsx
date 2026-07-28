import { useEffect, useMemo, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import {
  MdAssignment,
  MdBuild,
  MdError,
  MdNotificationsNone,
  MdNotificationsOff,
  MdPauseCircle,
  MdPending,
  MdRefresh,
  MdWarning,
} from 'react-icons/md';

import notificationService from '../../Services/notificationService';

import styles from './NotificationDropdown.module.css';

export default function NotificationDropdown() {
  const navigate = useNavigate();

  const wrapperRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  useEffect(() => {
    function handleDocumentClick(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        closeNotifications();
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        closeNotifications();
      }
    }

    document.addEventListener('mousedown', handleDocumentClick);

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);

      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  function loadNotifications() {
    const data = notificationService.getNotifications();

    setNotifications(data);
  }

  const unreadCount = useMemo(() => {
    return notifications.filter((notification) => !notification.read).length;
  }, [notifications]);

  function toggleNotifications(event) {
    event.stopPropagation();

    setIsOpen((current) => !current);
  }

  function closeNotifications() {
    setIsOpen(false);
  }

  function markAllAsRead(event) {
    event.stopPropagation();

    notificationService.markAllAsRead();

    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        read: true,
      })),
    );
  }

  function selectNotification(notification, event) {
    event.stopPropagation();

    notificationService.markAsRead(notification.id);

    setNotifications((current) =>
      current.map((item) =>
        item.id === notification.id
          ? {
              ...item,
              read: true,
            }
          : item,
      ),
    );

    if (!notification.route) {
      return;
    }

    closeNotifications();

    navigate(notification.route);
  }

  function getNotificationIcon(notification) {
    const iconMap = {
      error: MdError,
      warning: MdWarning,
      pause_circle: MdPauseCircle,
      pending: MdPending,
      assignment: MdAssignment,
      build: MdBuild,
      refresh: MdRefresh,
    };

    return iconMap[notification.icon] ?? MdNotificationsNone;
  }

  function getTypeClass(type) {
    const typeMap = {
      danger: styles.danger,
      warning: styles.warning,
      pending: styles.pending,
      rework: styles.rework,
      reprocess: styles.reprocess,
    };

    return typeMap[type] ?? '';
  }

  return (
    <div ref={wrapperRef} className={styles.notificationWrapper}>
      <button
        type="button"
        className={[styles.notificationButton, isOpen ? styles.active : '']
          .filter(Boolean)
          .join(' ')}
        aria-label="Abrir notificações"
        onClick={toggleNotifications}
      >
        <MdNotificationsNone />

        {unreadCount > 0 && (
          <span className={styles.notificationBadge}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <section
          className={styles.notificationPanel}
          onClick={(event) => event.stopPropagation()}
        >
          <header className={styles.notificationHeader}>
            <div className={styles.notificationTitle}>
              <h2>Notificações</h2>

              {unreadCount > 0 && (
                <span className={styles.headerBadge}>{unreadCount}</span>
              )}
            </div>

            <button
              type="button"
              className={styles.markAllButton}
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              Marcar todas como lidas
            </button>
          </header>

          <div className={styles.notificationList}>
            {notifications.length > 0 ? (
              notifications.map((notification) => {
                const NotificationIcon = getNotificationIcon(notification);

                return (
                  <button
                    key={notification.id}
                    type="button"
                    className={[
                      styles.notificationItem,

                      !notification.read ? styles.unread : '',

                      getTypeClass(notification.type),
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={(event) => selectNotification(notification, event)}
                  >
                    <div className={styles.notificationItemIcon}>
                      <NotificationIcon />
                    </div>

                    <div className={styles.notificationContent}>
                      <div className={styles.notificationContentHeader}>
                        <strong>{notification.title}</strong>

                        <time>{notification.time}</time>
                      </div>

                      <p>{notification.description}</p>
                    </div>

                    {!notification.read && (
                      <span className={styles.unreadIndicator} />
                    )}
                  </button>
                );
              })
            ) : (
              <div className={styles.emptyNotifications}>
                <MdNotificationsOff />

                <strong>Nenhuma notificação</strong>

                <span>Não existem novas notificações no momento.</span>
              </div>
            )}
          </div>

          <footer className={styles.notificationFooter}>
            <button type="button">Ver todas as notificações</button>
          </footer>
        </section>
      )}
    </div>
  );
}
