import { Routes, Route } from "react-router-dom";

import PublicLayout from "./layout/PublicLayout";
import AuthLayout from "./layout/AuthLayout";
import AdminLayout from "./layout/AdminLayout";
import AuthorLayout from "./layout/AuthorLayout";

import Home from "./pages/Home";
import BlogDetails from "./pages/BlogDetails";

import AdminLogin from "./pages/auth/AdminLogin";
import AdminRegister from "./pages/auth/AdminRegister";
import AuthorLogin from "./pages/auth/AuthorLogin";
import AuthorRegister from "./pages/auth/AuthorRegister";
import AuthorResetPassword from "./pages/auth/AuthorResetPassword";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminAuthors from "./pages/admin/AdminAuthors";
import AdminAuthorDetails from "./pages/admin/AdminAuthorDetails";
import AdminArticleManagement from "./pages/admin/AdminArticleManagement";
import AdminAnalytics from "./pages/admin/AdminAnalytics";

import AuthorDashboard from "./pages/author/AuthorDashboard";
import AuthorArticles from "./pages/author/AuthorArticles";
import AuthorCreatePost from "./pages/author/AuthorCreatePost";
import AuthorProfileSettings from "./pages/author/AuthorProfileSettings";

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/blogs/:id" element={<BlogDetails />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-register" element={<AdminRegister />} />
        <Route path="/author-login" element={<AuthorLogin />} />
        <Route path="/author-register" element={<AuthorRegister />} />
        <Route path="/author-reset-password" element={<AuthorResetPassword />} />
      </Route>

      <Route path="/admin-dashboard" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="authors" element={<AdminAuthors />} />
        <Route path="/admin-dashboard/authors/:id" element={<AdminAuthorDetails />} />
        <Route path="admin-articles" element={<AdminArticleManagement />} />
        <Route path="/admin-dashboard/analytics" element={<AdminAnalytics />} />
      </Route>

      <Route path="/author-dashboard" element={<AuthorLayout />}>
        <Route index element={<AuthorDashboard />} />
        <Route path="create-post" element={<AuthorCreatePost />} />
        <Route path="articles" element={<AuthorArticles />} />
        <Route path="profile" element={<AuthorProfileSettings />} /> 
     <Route path="/author-dashboard/create-post" element={<AuthorCreatePost />} />
<Route path="/author-dashboard/create-post/:id" element={<AuthorCreatePost />} />
      </Route>
    </Routes>
  );
}