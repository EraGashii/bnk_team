"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaSun, FaMoon, FaPlus, FaMinus } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

export default function SettingsPage() {
  const [user, setUser] = useState({ email: "", notifications: false });
  const [password, setPassword] = useState({ oldPassword: "", newPassword: "" });
  const [theme, setTheme] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("theme") || "dark" : "dark"
  );
  const [fontSize, setFontSize] = useState(() =>
    typeof window !== "undefined" ? parseInt(localStorage.getItem("fontSize")) || 16 : 16
  );

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/settings") // ✅ Make sure it's this URL
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Error fetching settings:", err));

    if (typeof window !== "undefined") {
      document.documentElement.classList.remove("dark", "light");
      document.documentElement.classList.add(theme);
      document.documentElement.style.fontSize = `${fontSize}px`;
    }
  }, [theme, fontSize]);

  const handleThemeChange = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme);
    }
  };

  const handleFontSizeChange = (change) => {
    const newSize = fontSize + change;
    if (newSize >= 12 && newSize <= 24) {
      setFontSize(newSize);
      if (typeof window !== "undefined") {
        localStorage.setItem("fontSize", newSize);
      }
    }
  };

  return (
    <div className="p-4 min-h-screen" style={{ fontSize: `${fontSize}px` }}>
      <h1 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-black"}`}>
        Settings
      </h1>

      <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-200 text-black"}`}>
        <h2 className="text-lg font-semibold">Preferences</h2>
        
        {/* Theme Toggle */}
        <div className="mt-4">
          <button
            onClick={handleThemeChange}
            className="p-2 rounded-full bg-gray-600 hover:bg-gray-800 transition duration-300"
          >
            {theme === "dark" ? <FaMoon className="text-white" size={24} /> : <FaSun className="text-black" size={24} />}
          </button>
        </div>

        {/* Font Size Adjustment */}
        <div className="mt-4 flex items-center space-x-4">
          <span>Font Size:</span>
          <button
            onClick={() => handleFontSizeChange(-2)}
            className="p-2 bg-gray-700 text-white rounded-full hover:bg-gray-600"
          >
            <FaMinus />
          </button>
          <span>{fontSize}px</span>
          <button
            onClick={() => handleFontSizeChange(2)}
            className="p-2 bg-gray-700 text-white rounded-full hover:bg-gray-600"
          >
            <FaPlus />
          </button>
        </div>
      </div>
    </div>
  );
}
