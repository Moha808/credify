import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase/config';
import { collection, query, where, onSnapshot, updateDoc, doc, writeBatch } from 'firebase/firestore';
import { Bell, CheckCheck, FileText, Award, X, ExternalLink, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NotificationBell = ({ currentUser, onOpenLetter }) => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;

    let q;
    const notifRef = collection(db, 'notifications');

    if (currentUser.role === 'applicant') {
      q = query(notifRef, where('recipientId', '==', currentUser.uid));
    } else if (currentUser.role === 'officer') {
      q = query(notifRef, where('recipientId', 'in', [currentUser.uid, 'officer', 'all_staff']));
    } else if (currentUser.role === 'admin') {
      q = query(notifRef, where('recipientId', 'in', [currentUser.uid, 'admin', 'all_staff']));
    } else {
      q = query(notifRef, where('recipientId', '==', currentUser.uid));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort client-side by createdAt descending
      list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
      setNotifications(list);
    }, (error) => {
      console.error('Error fetching notifications:', error);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = async (id) => {
    try {
      await updateDoc(doc(db, 'notifications', id), { read: true });
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const batch = writeBatch(db);
      notifications.filter(n => !n.read).forEach(n => {
        batch.update(doc(db, 'notifications', n.id), { read: true });
      });
      await batch.commit();
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const handleNotificationClick = (notif) => {
    handleMarkAsRead(notif.id);
    setIsOpen(false);

    if (notif.type === 'letter_issued' && onOpenLetter && notif.applicationId) {
      onOpenLetter(notif.applicationId);
    } else if (notif.type === 'new_application') {
      navigate('/dashboard/history');
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' · ' + date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return '';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        title="Notifications"
        aria-label="View notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse shadow-sm">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden text-slate-800 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-150">
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 text-[11px] font-semibold rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
              >
                <CheckCheck size={14} /> Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
            {notifications.length === 0 ? (
              <div className="py-10 text-center text-slate-400 px-4">
                <Bell size={24} className="mx-auto mb-2 opacity-30" />
                <p className="text-xs font-medium">No notifications yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">You'll be alerted when applications or recommendation letters are updated.</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer flex gap-3 text-left ${
                    !notif.read ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {notif.type === 'letter_issued' ? (
                      <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-950/60 text-green-600 dark:text-green-400 flex items-center justify-center">
                        <Award size={16} />
                      </div>
                    ) : notif.type === 'new_application' ? (
                      <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                        <FileText size={16} />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center">
                        <Bell size={16} />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <p className={`text-xs font-semibold truncate ${!notif.read ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-700 dark:text-slate-300'}`}>
                        {notif.title}
                      </p>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {notif.message}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">
                      {formatTime(notif.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default NotificationBell;
