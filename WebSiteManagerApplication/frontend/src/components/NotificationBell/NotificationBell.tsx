import React, { useState, useEffect } from 'react';
import { Badge, IconButton, Menu, MenuItem, Typography, Box, Divider } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { io, Socket } from 'socket.io-client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Notification {
  message: string;
  timestamp: Date;
  read: boolean;
}

const NotificationBell: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
      return JSON.parse(savedNotifications).map((n: any) => ({
        ...n,
        timestamp: new Date(n.timestamp)
      }));
    }
    return [];
  });
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    const newSocket = io('http://localhost:5000', {
      withCredentials: true,
      auth: { token: localStorage.getItem('access_token') }
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
        read: false
      }, ...prev].slice(0, 50));
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
    handleClose();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <IconButton
        color="inherit"
        onClick={handleClick}
        sx={{ ml: 2 }}
      >
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 360,
            maxHeight: 400,
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Notifications</Typography>
          {notifications.length > 0 && (
            <Box>
              <Typography
                variant="body2"
                color="primary"
                sx={{ cursor: 'pointer', mr: 2 }}
                onClick={markAllAsRead}
              >
                Tout marquer comme lu
              </Typography>
              <Typography
                variant="body2"
                color="error"
                sx={{ cursor: 'pointer' }}
                onClick={clearNotifications}
              >
                Effacer tout
              </Typography>
            </Box>
          )}
        </Box>

        <Divider />

        {notifications.length === 0 ? (
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary">
              Aucune notification
            </Typography>
          </MenuItem>
        ) : (
          notifications.map((notification, index) => (
            <MenuItem
              key={index}
              onClick={() => markAsRead(index)}
              sx={{
                backgroundColor: notification.read ? 'inherit' : 'action.hover',
                whiteSpace: 'normal',
                py: 1.5,
              }}
            >
              <Box>
                <Typography variant="body1">{notification.message}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {format(notification.timestamp, 'PPp', { locale: fr })}
                </Typography>
              </Box>
            </MenuItem>
          ))
        )}
      </Menu>
    </>
  );
};

export default NotificationBell;