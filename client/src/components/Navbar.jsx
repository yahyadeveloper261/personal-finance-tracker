import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { profile } from "../services/userApi";

import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../services/notificationApi";

import {
  Menu,
  Bell,
  ChevronDown,
  CalendarDays,
  CircleUserRound,
  Wallet,
  AlertTriangle,
  TrendingUp,
  PiggyBank,
  CheckCircle2,
  CheckCheck,
  X,
} from "lucide-react";

const notificationStyles = {
  budget: {
    icon: AlertTriangle,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  income: {
    icon: Wallet,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  expense: {
    icon: Wallet,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  exceeded: {
    icon: TrendingUp,
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
  summary: {
    icon: CheckCircle2,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  savings: {
    icon: PiggyBank,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
};

export default function Navbar({ setOpen }) {
  const [pro, setPro] = useState(null);

  const [showNotifications, setShowNotifications] = useState(false);

  const [notifications, setNotifications] = useState([]);

  const [loadingNotifications, setLoadingNotifications] = useState(true);

  const [unreadCount, setUnreadCount] = useState(0);

  const [markingAll, setMarkingAll] = useState(false);

  const navigate = useNavigate();

  // ================= GET PROFILE =================

  useEffect(() => {
    const getProfile = async () => {
      try {
        const res = await profile();
        setPro(res?.profile);
      } catch (error) {
        console.log("Navbar Profile Error:", error);
      }
    };

    getProfile();
  }, []);

  // ================= GET NOTIFICATIONS =================

  useEffect(() => {
    let isMounted = true;

    const fetchNotifications = async () => {
      try {
        const res = await getNotifications();

        if (!isMounted) return;

        setNotifications(res.notifications || []);
        setUnreadCount(res.unreadCount || 0);
      } catch (error) {
        console.log("Notification Error:", error.message);
      } finally {
        if (isMounted) {
          setLoadingNotifications(false);
        }
      }
    };

    fetchNotifications();

    const interval = setInterval(fetchNotifications, 10000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // ================= MARK AS READ =================

  const markAsRead = async (id) => {
    const selectedNotification = notifications.find((item) => item._id === id);

    if (!selectedNotification || selectedNotification.isRead) {
      return;
    }

    try {
      await markNotificationAsRead(id);

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, isRead: true } : item,
        ),
      );

      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.log("Mark Read Error:", error.message);
    }
  };

  // ================= MARK ALL AS READ =================

  const markAllAsRead = async () => {
    if (unreadCount === 0) return;

    try {
      setMarkingAll(true);

      await markAllNotificationsAsRead();

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          isRead: true,
        })),
      );

      setUnreadCount(0);
    } catch (error) {
      console.log("Mark All Read Error:", error.message);
    } finally {
      setMarkingAll(false);
    }
  };

  // ================= NOTIFICATION TIME =================

  const formatNotificationTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString("en-US", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <header className="sticky top-0 z-30 h-20 border-b border-indigo-100/80 bg-white/95 px-4 shadow-[0_3px_20px_rgba(79,70,229,0.04)] backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex h-full items-center justify-between">
        {/* Left Section */}

        <div className="flex items-center gap-4">
          <button
            onClick={() => setOpen((prev) => !prev)}
            title="Toggle Sidebar"
            className="group flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200 transition-all duration-200 hover:-translate-y-0.5 hover:from-indigo-700 hover:to-violet-700 active:scale-95"
          >
            <Menu size={21} strokeWidth={2.5} />
          </button>

          <div>
            <h2 className="text-base font-extrabold tracking-tight text-slate-800 sm:text-lg">
              Financial Dashboard
            </h2>

            <div className="mt-0.5 hidden items-center gap-1.5 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

              <p className="text-xs font-medium text-slate-400">
                Welcome to your workspace
              </p>
            </div>
          </div>
        </div>

        {/* Right Section */}

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Date */}

          <div className="hidden items-center gap-2 rounded-xl border border-violet-100 bg-gradient-to-r from-indigo-50 to-violet-50 px-3 py-2.5 lg:flex">
            <CalendarDays size={17} className="text-indigo-600" />

            <span className="text-xs font-bold text-indigo-900">
              {new Date().toLocaleDateString("en-US", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          {/* Notification */}

          <div className="relative">
            <button
              onClick={() => setShowNotifications((prev) => !prev)}
              title="Notifications"
              className="group relative flex h-10 w-10 items-center justify-center rounded-xl border border-amber-100 bg-amber-50 text-amber-600 transition-all duration-200 hover:border-amber-200 hover:bg-amber-100 hover:shadow-md"
            >
              <Bell size={20} />

              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-rose-500 px-1 text-[10px] font-bold text-white">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}

            {showNotifications && (
              <div className="absolute right-0 top-14 z-50 w-[340px] overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl shadow-slate-300/40 sm:w-[390px]">
                {/* Header */}

                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-800">
                      Notifications
                    </h3>

                    <p className="mt-0.5 text-xs text-slate-400">
                      You have {unreadCount} unread notifications
                    </p>
                  </div>

                  <button
                    onClick={() => setShowNotifications(false)}
                    className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Mark All Read */}

                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <span className="text-xs font-bold text-slate-500">
                    Recent Activity
                  </span>

                  <button
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0 || markingAll}
                    className="flex items-center gap-1 text-xs font-bold text-indigo-600 transition hover:text-indigo-800 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <CheckCheck size={14} />

                    {markingAll ? "Updating..." : "Mark all as read"}
                  </button>
                </div>

                {/* Notification List */}

                <div className="max-h-[380px] overflow-y-auto">
                  {loadingNotifications ? (
                    <div className="px-4 py-10 text-center">
                      <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-indigo-100 border-t-indigo-600" />

                      <p className="mt-3 text-sm text-slate-400">
                        Loading notifications...
                      </p>
                    </div>
                  ) : notifications.length > 0 ? (
                    notifications.map((item) => {
                      const style =
                        notificationStyles[item.type] ||
                        notificationStyles.summary;

                      const Icon = style.icon;

                      return (
                        <div
                          key={item._id}
                          onClick={() => markAsRead(item._id)}
                          className={`flex cursor-pointer gap-3 border-b border-slate-50 px-4 py-4 transition hover:bg-slate-50 ${
                            !item.isRead ? "bg-indigo-50/40" : ""
                          }`}
                        >
                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${style.bg} ${style.color}`}
                          >
                            <Icon size={19} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <h4 className="text-sm font-bold text-slate-800">
                                {item.title}
                              </h4>

                              {!item.isRead && (
                                <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-600" />
                              )}
                            </div>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                              {item.message}
                            </p>

                            <p className="mt-2 text-[11px] font-medium text-slate-400">
                              {formatNotificationTime(item.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="px-4 py-10 text-center">
                      <Bell size={30} className="mx-auto text-slate-300" />

                      <p className="mt-3 text-sm font-bold text-slate-600">
                        No notifications
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        You're all caught up!
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer */}

                <div className="border-t border-slate-100 bg-slate-50/70 px-4 py-3 text-center">
                  <p className="text-xs font-semibold text-slate-400">
                    Stay updated with your finances
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}

          <button
            onClick={() => navigate("/settings")}
            className="flex items-center gap-2 rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50/70 to-violet-50/70 p-1.5 transition-all duration-200 hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-100 sm:gap-3"
          >
            {pro?.image ? (
              <img
                src={pro.image}
                alt="Profile"
                className="h-10 w-10 rounded-xl border border-indigo-100 object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 text-white shadow-md">
                <CircleUserRound size={23} />
              </div>
            )}

            <div className="hidden text-left sm:block">
              <p className="text-sm font-extrabold text-slate-800">
                {pro?.name || "User"}
              </p>

              <p className="text-[11px] font-semibold text-indigo-500">
                Personal Account
              </p>
            </div>

            <ChevronDown
              size={16}
              className="mr-1 hidden text-indigo-500 sm:block"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
