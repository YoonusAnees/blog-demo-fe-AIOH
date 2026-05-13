import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";

const AuthorCard = ({ author, getAvatarUrl, deleteAuthor }) => {
  return (
    <Link
      to={`/admin-dashboard/authors/${author._id}`}
      className="group relative h-[235px] overflow-hidden rounded-[24px] bg-slate-300 shadow-sm"
    >
      <img
        src={getAvatarUrl(author)}
        alt={author.name}
        className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent"></div>

      <div className="absolute bottom-7 left-6 right-6">
        <h2 className="text-2xl font-black leading-none text-white">
          {author.name}
        </h2>

        <p className="mt-3 text-xs font-bold uppercase tracking-[2px] text-slate-300">
          {author.professionalTitle || "Senior Analyst"}
        </p>
      </div>

      <button
        onClick={(e) => deleteAuthor(e, author._id)}
        className="absolute right-4 top-4 flex h-10 w-10 translate-y-[-8px] items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow-lg transition duration-300 hover:bg-red-600 group-hover:translate-y-0 group-hover:opacity-100"
      >
        <MdDelete size={20} />
      </button>
    </Link>
  );
};

export default AuthorCard;
