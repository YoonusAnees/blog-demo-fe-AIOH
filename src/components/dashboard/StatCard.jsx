import CountUp from "./CountUp";

const StatCard = ({ title, value, icon }) => {
  return (
    <div className="relative rounded-sm bg-[#01213A] p-6 text-center shadow-xl border-t border-r border-b border-8 border-[#18d89d]">
      <p className="text-xs font-black tracking-widest text-slate-400">
        {title}
      </p>

      <h2 className="mt-2 text-4xl font-black text-white">
        <CountUp end={value || 0} />
      </h2>

      <div className="absolute bottom-6 right-5 text-xl text-[#18d89d] opacity-80">
        {icon}
      </div>
    </div>
  );
};

export default StatCard;
