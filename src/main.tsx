import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Ensure tailwind.css is imported if not already handled globally by index.html linking
// For many build tools (like Vite, Parcel, Next.js, Remix), importing it here ensures it's part of the build.
// Since we linked it in index.html, this explicit import might be redundant for some setups but good practice for others.
// import '../tailwind.css'; // Adjust path if your tailwind.css is elsewhere relative to src

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Failed to find the root element with ID 'root'");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
