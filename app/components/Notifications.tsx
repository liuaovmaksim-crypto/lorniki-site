"use client";

import { useEffect, useState } from "react";
import { UserProfile } from "./config";

type NotificationItem = {
  id: number;
  text: string;
  time: string;
  read: boolean;
};

export default function Notifications({
  currentUser,
}: {
  currentUser: UserProfile;
}) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("kamiko-notifications");
    if (saved) {
      setNotifications(JSON.parse(saved));
    } else {
      const demo = [
        {
          id: 1,
          text: "Добро пожаловать в Kamiko.mi",
          time: "сейчас",
          read: false,
        },
      ];
      setNotifications(demo);
      localStorage.setItem("kamiko-notifications", JSON.stringify(demo));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "kamiko-notifications",
      JSON.stringify(notifications)
    );
  }, [notifications]);

  const unread = notifications.filter((n) => !n.read).length;

  function markAllRead() {
    setNotifications((list) =>
      list.map((n) => ({ ...n, read: true }))
    );
  }

  return (
    <div className="relative">
      {/* КОЛОКОЛЬЧИК */}
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-full border border-white/10 bg-black/30 px-5 py-3 backdrop-blur-xl hover:scale-105 transition"
      >
        🔔

        {unread > 0 && (
          <span className="absolute -top-2 -right-2 rounded-full bg-[var(--accent)] px-2 py-0.5 text-xs font-black text-black">
            {unread}
          </span>
        )}
      </button>

      {/* ВЫПАДАЮЩЕЕ ОКНО */}
      {open && (
        <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-white/10 bg-black/90 p-4 text-white backdrop-blur-xl z-50">
          <div className="flex justify-between items-center">
            <h3 className="font-black">Уведомления</h3>
            <button
              onClick={markAllRead}
              className="text-xs text-[var(--accent)]"
            >
              Прочитать всё
            </button>
          </div>

          <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
            {notifications.length === 0 && (
              <p className="text-sm text-white/40">
                Уведомлений нет
              </p>
            )}

            {notifications.map((n) => (
              <div
                key={n.id}
                className={`rounded-xl p-3 text-sm ${
                  n.read
                    ? "bg-white/[0.03]"
                    : "bg-[var(--accent)]/10"
                }`}
              >
                <p>{n.text}</p>
                <span className="text-xs text-white/40">
                  {n.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function addNotification({
  user,
  type,
  title,
  text,
}: {
  user: string;
  type: string;
  title: string;
  text: string;
}) {
  const saved = localStorage.getItem("kamiko-notifications");
  let list = saved ? JSON.parse(saved) : [];

  const newNotification = {
    id: Date.now(),
    user,
    type,
    title,
    text,
    time: "только что",
    read: false,
  };

  list = [newNotification, ...list];

  localStorage.setItem("kamiko-notifications", JSON.stringify(list));
}