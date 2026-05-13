import { Link } from "react-router-dom";
import { IoNotificationsOutline, IoTimeOutline, IoCheckmarkDoneOutline } from "react-icons/io5";

const NotificationDropdown = ({ 
  notifications, 
  unreadCount, 
  markAllAsRead, 
  markAsRead, 
  setShowNotifications, 
  baseUrl 
}) => {
  return (
    <div className="absolute right-0 top-full mt-2 w-80 overflow-hidden rounded-2xl bg-white text-slate-900 shadow-2xl ring-1 ring-black/5">
      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-4 py-3">
        <h3 className="text-sm font-black text-slate-800">Notifications</h3>
        {unreadCount > 0 && (
          <button 
            onClick={markAllAsRead}
            className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700"
          >
            <IoCheckmarkDoneOutline className="text-sm" />
            Mark all read
          </button>
        )}
      </div>

      <div className="max-h-[380px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 opacity-40">
            <IoNotificationsOutline className="mb-2 text-3xl" />
            <p className="text-xs font-bold">No notifications yet</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div 
              key={n._id}
              onClick={() => {
                if (!n.read) markAsRead(n._id);
                setShowNotifications(false);
              }}
              className={`group flex items-start gap-3 border-b border-gray-50 px-4 py-4 transition-colors hover:bg-emerald-50/30 ${!n.read ? "bg-emerald-50/10" : ""}`}
            >
              <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-full bg-slate-200 shadow-inner">
                {n.sender?.avatar ? (
                  <img src={`${baseUrl}${n.sender.avatar}`} className="h-full w-full object-cover" alt="" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-emerald-500 text-xs font-black text-white">
                    {n.sender?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-1">
                <p className="text-[13px] leading-snug">
                  <span className="font-black text-slate-900">{n.sender?.name}</span>
                  <span className="text-slate-600"> {n.type === "like" ? "liked your article" : "commented on"} </span>
                  <Link to={`/blogs/${n.blog?._id}`} className="font-bold text-emerald-600 hover:underline">
                    "{n.blog?.title}"
                  </Link>
                </p>
                
                <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-400">
                  <IoTimeOutline />
                  {new Date(n.createdAt).toLocaleDateString() === new Date().toLocaleDateString() 
                    ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : new Date(n.createdAt).toLocaleDateString()}
                </div>
              </div>

              {!n.read && (
                <div className="mt-2 h-2 w-2 rounded-full bg-emerald-500 shadow-sm" />
              )}
            </div>
          ))
        )}
      </div>

      {notifications.length > 0 && (
        <div className="bg-gray-50 p-2 text-center">
          <button className="text-[11px] font-black uppercase tracking-wider text-slate-400 transition hover:text-slate-600">
            See All Activity
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
