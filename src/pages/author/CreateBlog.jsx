import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function CreateBlog() {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [loading,setLoading] = useState(false);

  const [form,setForm] = useState({
    title:"",
    category:"Technology",
    tags:"",
    excerpt:"",
    image:"",
    content:"",
    status:"Published"
  });

  if(!user || user.role !== "admin"){
    return(
      <main className="flex min-h-[80vh] items-center justify-center px-5">
        <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center">
          <h1 className="text-2xl font-black">
            Access Denied
          </h1>

          <p className="mt-2 text-slate-300">
            Only admins can create blogs.
          </p>
        </div>
      </main>
    )
  }

  const handleChange = (e)=>{
    setForm({
      ...form,
      [e.target.name]:e.target.value
    });
  };

  const submitHandler = async(e)=>{
    e.preventDefault();

    try{
      setLoading(true);

      await api.post(
        "/blogs/create",
        {
          ...form,
          tags: form.tags
            .split(",")
            .map(tag=>tag.trim())
            .filter(Boolean)
        }
      );

      navigate("/");

    }catch(error){
      alert(
        error.response?.data?.message ||
        "Blog creation failed"
      );
    }finally{
      setLoading(false);
    }
  };

  return(
<main className="mx-auto max-w-4xl px-5 py-10">

<div className="rounded-[30px] border border-white/10 bg-white/10 p-8 md:p-10 backdrop-blur">

<div className="mb-8">
<p className="text-sm font-semibold uppercase tracking-[0.3em] text-blue-400">
Admin Dashboard
</p>

<h1 className="mt-4 text-4xl font-black">
Create Blog Article
</h1>

<p className="mt-3 text-slate-400">
Publish rich content with category,
tags and featured image.
</p>
</div>

<form
onSubmit={submitHandler}
className="space-y-6"
>

{/* TITLE */}
<div>
<label className="mb-2 block text-sm font-semibold">
Blog Title
</label>

<input
name="title"
value={form.title}
onChange={handleChange}
placeholder="Enter article title"
className="w-full rounded-2xl border border-black/10 bg-grey px-5 py-4 outline-none focus:border-blue-950
"
/>
</div>


<div className="grid gap-6 md:grid-cols-2">

{/* CATEGORY */}
<div>
<label className="mb-2 block text-sm font-semibold">
Category
</label>

<select
name="category"
value={form.category}
onChange={handleChange}
className="w-full rounded-2xl border border-black/10 bg-grey px-5 py-4 outline-none focus:border-blue-950"
>
<option>Technology</option>
<option>Business</option>
<option>Education</option>
<option>Travel</option>
<option>Health</option>
<option>Lifestyle</option>
<option>News</option>
<option>Other</option>
</select>
</div>


{/* STATUS */}
<div>
<label className="mb-2 block text-sm font-semibold">
Status
</label>

<select
name="status"
value={form.status}
onChange={handleChange}
className="w-full rounded-2xl border border-black/10 bg-grey px-5 py-4 outline-none focus:border-blue-950"
>
<option>Published</option>
<option>Draft</option>
</select>
</div>

</div>


{/* TAGS */}
<div>
<label className="mb-2 block text-sm font-semibold">
Tags
</label>

<input
name="tags"
value={form.tags}
onChange={handleChange}
placeholder="react,node,javascript"
className="w-full rounded-2xl border border-black/10 bg-grey px-5 py-4 outline-none focus:border-blue-950"
/>

<p className="mt-2 text-xs text-slate-500">
Separate tags with commas
</p>
</div>


{/* EXCERPT */}
<div>
<label className="mb-2 block text-sm font-semibold">
Short Description
</label>

<textarea
rows="4"
name="excerpt"
value={form.excerpt}
onChange={handleChange}
placeholder="Short summary for blog cards..."
className="w-full rounded-2xl border border-black/10 bg-grey px-5 py-4 outline-none focus:border-blue-950"
/>
</div>


{/* IMAGE */}
<div>
<label className="mb-2 block text-sm font-semibold">
Featured Image URL
</label>

<input
name="image"
value={form.image}
onChange={handleChange}
placeholder="https://..."
className="w-full rounded-2xl border border-black/10 bg-grey px-5 py-4 outline-none focus:border-blue-950"
/>
</div>


{/* CONTENT */}
<div>
<label className="mb-2 block text-sm font-semibold">
Article Content
</label>

<textarea
rows="14"
name="content"
value={form.content}
onChange={handleChange}
placeholder="Write full article..."
className="w-full rounded-2xl border border-black/10 bg-grey px-5 py-4 outline-none focus:border-blue-950"
/>
</div>


{/* PREVIEW TAGS */}
{form.tags && (
<div className="flex flex-wrap gap-3">
{form.tags
.split(",")
.map(tag=>tag.trim())
.filter(Boolean)
.map(tag=>(
<span
key={tag}
className="rounded-full bg-blue-500/20 px-3 py-2 text-xs font-bold text-blue-300"
>
#{tag}
</span>
))}
</div>
)}


<div className="flex gap-4 pt-4">

<button
type="submit"
disabled={loading}
className="rounded-2xl bg-blue-600 px-7 py-4 font-bold hover:bg-blue-500 disabled:opacity-50"
>
{loading
? "Publishing..."
: "Publish Blog"}
</button>

<button
type="button"
onClick={()=>navigate("/")}
className="rounded-2xl border border-white/10 px-7 py-4 font-bold hover:bg-white/10"
>
Cancel
</button>

</div>

</form>
</div>

</main>
  )
}