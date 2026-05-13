import { FaRegNewspaper, FaRegHeart } from "react-icons/fa";
import { BiComment } from "react-icons/bi";
import { IoShareSocialOutline } from "react-icons/io5";

const ContributorCard = ({ person, index, baseUrl }) => {
  return (
    <div className="rounded-[26px] bg-white p-3 shadow-[0_18px_45px_rgba(15,23,42,0.12)]">
      <div className="relative h-[180px] overflow-hidden rounded-[22px]">
        <img
          src={
            person.avatar
              ? `${baseUrl}${person.avatar}`
              : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  person.name || "Author"
                )}&background=01213A&color=fff&size=300`
          }
          alt={person.name}
          className="h-80 w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent"></div>

        <div className="absolute bottom-5 left-6">
          <h3 className="text-2xl font-black text-white">
            {person.name || `Contributor ${index + 1}`}
          </h3>

          <p className="mt-1 text-xs font-bold uppercase tracking-[2px] text-slate-300">
            {person.professionalTitle || "Senior Analyst"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-y-6 px-6 py-8">
        <div className="border-l-[3px] border-[#24465d] pl-4">
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase text-slate-500">
            <FaRegNewspaper /> Posts
          </p>
          <h4 className="mt-2 text-xl font-black text-[#20252b]">
            {person.posts || 0}
          </h4>
        </div>

        <div className="border-l-[3px] border-[#24465d] pl-4">
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase text-slate-500">
            <FaRegHeart /> Likes
          </p>
          <h4 className="mt-2 text-xl font-black text-[#20252b]">
            {person.likes || 0}
          </h4>
        </div>

        <div className="border-l-[3px] border-[#24465d] pl-4">
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase text-slate-500">
            <BiComment /> Comments
          </p>
          <h4 className="mt-2 text-xl font-black text-[#20252b]">
            {person.Count || 0}
          </h4>
        </div>

        <div className="border-l-[3px] border-[#24465d] pl-4">
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase text-slate-500">
            <IoShareSocialOutline /> Shares
          </p>
          <h4 className="mt-2 text-xl font-black text-[#20252b]">
            {person.shares || 0}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default ContributorCard;
