import React, { useState, useEffect } from 'react';
import { Icon } from "@iconify/react/dist/iconify.js";
import { useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Notification {
  message: string;
  timestamp: Date;
  read: boolean;
  type: 'newLicenceRequest' | 'newFormResponse';
}

const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      return JSON.parse(savedNotifications).map((n: any) => ({
        ...n,
        timestamp: new Date(n.timestamp),
        type: n.type || 'newLicenceRequest', // fallback for old notifications
      }));
    }
    return [];
  });
  const [socket, setSocket] = useState<Socket | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      withCredentials: true,
      auth: { token: localStorage.getItem('token') }
    });

    newSocket.on('connect', () => {
      console.log('✅ CONNECTÉ au serveur WebSocket');
    });

    newSocket.on('disconnect', () => {
      console.log('❌ DÉCONNECTÉ du serveur WebSocket');
    });

    newSocket.on('connect_error', (err) => {
      console.error('Erreur de connexion WebSocket:', err.message);
    });

    newSocket.on('newLicenceRequest', (message: string) => {
      console.log('📩 Notification reçue:', message);
      setNotifications(prev => [{
        message,
        timestamp: new Date(),
        read: false,
        type: 'newLicenceRequest' as const
      }, ...prev].slice(0, 50));
    });

    newSocket.on('newFormResponse', (message: string) => {
        console.log('📝 Nouvelle réponse de formulaire reçue:', message);
        setNotifications(prev => [{
          message,
          timestamp: new Date(),
          read: false,
          type: 'newFormResponse' as const
        }, ...prev].slice(0, 50));
      });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const markAsRead = (index: number) => {
    setNotifications(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], read: true };
      return updated;
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
  };

  const clearNotifications = () => {
    setNotifications([]);
    localStorage.removeItem('notifications');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className='dropdown'>
      <button
        className='has-indicator w-40-px h-40-px bg-neutral-200 rounded-circle d-flex justify-content-center align-items-center'
        type='button'
        data-bs-toggle='dropdown'
      >
        <Icon
          icon='iconoir:bell'
          className='text-primary-light text-xl'
        />
        {unreadCount > 0 && (
          <span className='position-absolute top-0 end-0 w-16-px h-16-px bg-danger-main rounded-circle d-flex justify-content-center align-items-center'>
            <span className='text-white text-xs fw-bold'>{unreadCount}</span>
          </span>
        )}
      </button>
      <div className='dropdown-menu to-top dropdown-menu-lg p-0'>
        <div className='m-16 py-12 px-16 radius-8 bg-primary-50 mb-16 d-flex align-items-center justify-content-between gap-2'>
          <div>
            <h6 className='text-lg text-primary-light fw-semibold mb-0'>
              Notifications
            </h6>
          </div>
          <div className='d-flex align-items-center gap-2'>
            {notifications.length > 0 && (
              <>
                <button
                  onClick={markAllAsRead}
                  className='text-primary-600 fw-semibold text-sm hover-text-primary-dark'
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Tout marquer
                </button>
                <button
                  onClick={clearNotifications}
                  className='text-danger fw-semibold text-sm hover-text-danger-dark'
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Effacer
                </button>
              </>
            )}
            <span className='text-primary-600 fw-semibold text-lg w-40-px h-40-px rounded-circle bg-base d-flex justify-content-center align-items-center'>
              {unreadCount}
            </span>
          </div>
        </div>
        <div className='max-h-400-px overflow-y-auto scroll-sm pe-4'>
          {notifications.length === 0 ? (
            <div className='px-24 py-12 text-center'>
              <p className='text-secondary-light mb-0'>Aucune notification</p>
            </div>
          ) : (
            notifications.map((notification, index) => (
              <div
                key={index}
                onClick={() => {
                  markAsRead(index);
                  console.log('Notification type:', notification.type); // debug
                  if (notification.type === 'newLicenceRequest') {
                    navigate('/LicenceRequestsList');
                  } else if (notification.type === 'newFormResponse') {
                    navigate('/FormSubmissions');
                  }
                }}
                className={`px-24 py-12 d-flex align-items-start gap-3 mb-2 justify-content-between cursor-pointer ${
                  notification.read ? '' : 'bg-neutral-50'
                }`}
                style={{ cursor: 'pointer' }}
              >
                <div className='text-black hover-bg-transparent hover-text-primary d-flex align-items-center gap-3'>
                  <span className='w-44-px h-44-px bg-info-subtle text-info-main rounded-circle d-flex justify-content-center align-items-center flex-shrink-0'>
                    <Icon
                      icon='iconoir:bell'
                      className='icon text-lg'
                    />
                  </span>
                  <div>
                    <h6 className='text-md fw-semibold mb-4'>
                      Nouvelle notification
                    </h6>
                    <p className='mb-0 text-sm text-secondary-light text-w-200-px'>
                      {notification.message}
                    </p>
                  </div>
                </div>
                <span className='text-sm text-secondary-light flex-shrink-0'>
                  {format(notification.timestamp, 'HH:mm', { locale: fr })}
                </span>
              </div>
            ))
          )}
        </div>
        {notifications.length > 0 && (
          <div className='text-center py-12 px-16'>
            <button
              onClick={clearNotifications}
              className='text-primary-600 fw-semibold text-md hover-text-primary-dark'
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Voir toutes les notifications
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationBell;