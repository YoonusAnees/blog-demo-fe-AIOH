import { useEffect, useState } from "react";
import api from "../../api/axios";
import AuthorCard from "../../components/dashboard/AuthorCard";

export default function AdminAuthors() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);

  const baseUrl = import.meta.env.VITE_API_URL.replace("/api", "");

  const loadAuthors = async () => {
    try {
      const res = await api.get("/users/authors");
      setAuthors(res.data.data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuthors();
  }, []);

  const getAvatarUrl = (author) => {
    if (!author.avatar) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        author.name || "Author"
      )}&background=01213A&color=fff&size=400`;
    }
    if (author.avatar.startsWith("http")) return author.avatar;
    return `${baseUrl}${author.avatar}`;
  };

  const deleteAuthor = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();

    const ok = window.confirm("Are you sure you want to remove this author?");
    if (!ok) return;

    try {
      await api.delete(`/users/authors/${id}`);
      loadAuthors();
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#18d89d] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen px-6 py-12 text-[#20252b] md:px-12 mt-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-black">Contributor Management</h1>

        <div className="mt-12 grid gap-x-12 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {authors.map((author) => (
            <AuthorCard 
              key={author._id} 
              author={author} 
              getAvatarUrl={getAvatarUrl} 
              deleteAuthor={deleteAuthor} 
            />
          ))}
        </div>
      </div>
    </main>
  );
}