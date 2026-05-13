import CountUp from "./CountUp";

const StatCard = ({ title, value, icon, growth }) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#01213A] p-9 text-slate-800 dark:text-white shadow-lg border-l-4 border-[#18d89d] transition-all duration-300">
      <p className="text-[10px] font-black tracking-widest text-slate-500 dark:text-white/50 uppercase">
        {title}
      </p>

      <h2 className="mt-3 text-4xl font-black">
        {typeof value === "number" ? <CountUp end={value || 0} /> : value}
      </h2>

      {growth && (
        <div className="absolute bottom-6 right-6 text-[10px] font-bold text-[#18d89d]">
          {growth}
        </div>
      )}

      {icon && !growth && (
        <div className="absolute bottom-6 right-6 text-[#18d89d] opacity-90">
          {icon}
        </div>
      )}
    </div>
  );
};

export default StatCard;
