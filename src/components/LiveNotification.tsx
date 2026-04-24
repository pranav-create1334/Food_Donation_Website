import { motion, AnimatePresence } from 'motion/react';
import { Bell, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface NotificationProps {
  message: string;
  type?: 'success' | 'info' | 'alert';
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<(NotificationProps & { id: string })[]>([]);

  const addNotification = (notif: NotificationProps) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [...prev, { ...notif, id }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };

  return { notifications, addNotification };
}

export default function LiveNotification({ notifications }: { notifications: (NotificationProps & { id: string })[] }) {
  return (
    <div className="fixed top-24 right-6 z-[60] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className="pointer-events-auto bg-white border border-slate-100 shadow-elevation rounded-2xl p-4 min-w-[280px] max-w-sm flex items-start gap-4"
          >
            <div className="bg-primary/10 p-2 rounded-xl text-primary">
              <Bell className="w-5 h-5" />
            </div>
            <div className="flex-grow pt-0.5">
              <p className="text-sm font-bold text-slate-800 leading-snug">
                {notif.message}
              </p>
            </div>
            <button className="text-slate-300 hover:text-slate-500 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
