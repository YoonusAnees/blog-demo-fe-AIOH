# AIOH Blog Frontend

A modern, high-performance blogging platform built with React and Vite. This application serves as the frontend for the AIOH Blog, featuring a rich, premium user interface, real-time notifications, and a multi-tiered role system (Admin, Author, and User).

## 🚀 Features

- **Multi-Role Dashboards**: Dedicated command centers for Administrators, Authors, and general Users, complete with specialized sidebar navigation and secure routing.
- **Rich Text Editor**: Integrated with Editor.js for a seamless, block-style article writing and editing experience.
- **Real-Time Notifications**: Instant, real-time notifications via `socket.io-client` for interactions like comments, likes, and shares.
- **Advanced Security**: Fully integrated with the backend using secure, HttpOnly cookies for session management and automated CSRF token handling.
- **Dynamic Theming**: Built-in Light and Dark modes using Tailwind CSS.
- **Analytics & Data Visualization**: Interactive charts for authors and admins built with Recharts.
- **Cloudinary Integration**: Direct support for handling and rendering absolute Cloudinary image URLs for avatars and article thumbnails.

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios (configured with interceptors and credentials)
- **Editor**: Editor.js with various block tools (Header, Image, List, Code, Quote)
- **Icons**: React Icons
- **Real-time**: Socket.IO Client

## ⚙️ Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/allinoneholdings/blog-demo-fe-AIOH.git
   cd blog-demo-fe-AIOH
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory based on `.env.example` (if available) or add the following:
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to the address shown in your terminal (usually `http://localhost:5174`).

## 🔐 Security Notes

This application relies on a secure backend architecture. 
- **Authentication**: JWT tokens are managed entirely by the backend via `HttpOnly` cookies. The frontend does not store sensitive tokens in `localStorage`.
- **CSRF Protection**: The application automatically fetches an `x-csrf-token` on load and injects it into all modifying requests (`POST`, `PUT`, `PATCH`, `DELETE`) via Axios interceptors.

## 📦 Build for Production

To create a production-ready build:

```bash
npm run build
```

The output will be generated in the `dist/` directory, ready to be served by any static file host.

---
*Developed by the AIOH Team.*
