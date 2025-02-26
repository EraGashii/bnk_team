"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaSun, FaMoon } from "react-icons/fa"; // ✅ Importo ikonat e diellit dhe hënës
import "react-toastify/dist/ReactToastify.css";

export default function SettingsPage() {
  const [user, setUser] = useState({ email: "", notifications: false });
  const [password, setPassword] = useState({ oldPassword: "", newPassword: "" });
  const [theme, setTheme] = useState(() =>
    typeof window !== "undefined" ? localStorage.getItem("theme") || "dark" : "dark"
  );

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/settings")
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Error fetching settings:", err));

    if (typeof window !== "undefined") {
      document.body.className = theme; // ✅ Apliko temën në `body`
    }
  }, [theme]);

  const handlePasswordChange = async () => {
    try {
      await axios.put("http://localhost:4000/api/settings/password", password);
      toast.success("Password updated successfully!");
    } catch (err) {
      toast.error("Error updating password!");
    }
  };

  const handleEmailChange = async () => {
    try {
      await axios.put("http://localhost:4000/api/settings/email", { email: user.email });
      toast.success("Email updated successfully!");
    } catch (err) {
      toast.error("Error updating email!");
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;
    try {
      await axios.delete("http://localhost:4000/api/settings/delete");
      toast.success("Account deleted successfully!");
    } catch (err) {
      toast.error("Error deleting account!");
    }
  };

  const handleThemeChange = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme);
      document.documentElement.classList.remove("dark", "light");
      document.documentElement.classList.add(newTheme);
    }
  };

  const handleNotificationsChange = async (enabled) => {
    setUser((prev) => ({ ...prev, notifications: enabled }));

    try {
      await axios.put("http://localhost:4000/api/settings/notifications", {
        notifications: enabled,
      });
      toast.success(`Notifications ${enabled ? "enabled" : "disabled"}!`);
    } catch (err) {
      toast.error("Error updating notifications!");
    }
  };

  return (
    <div className="p-4">
      <h1 className={`text-2xl font-bold ${theme === "dark" ? "text-white" : "text-black"}`}>
        Settings
      </h1>

      <div className="bg-gray-800 p-4 rounded-lg">
        <h2 className="text-lg font-semibold text-white">Account Settings</h2>
        <div className="mt-4 space-y-2">
          {/* Input për Email */}
          <div>
            <label className="block text-white">Change Email:</label>
            <input
              type="email"
              className="p-2 rounded bg-white text-black"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
            <button className="ml-2 p-2 bg-blue-500 text-white rounded" onClick={handleEmailChange}>
              Update Email
            </button>
          </div>

          {/* Input për Password */}
          <div>
            <label className="block text-white">Change Password:</label>
            <input
              type="password"
              className="p-2 rounded bg-white text-black"
              placeholder="Old Password"
              onChange={(e) => setPassword({ ...password, oldPassword: e.target.value })}
            />
            <input
              type="password"
              className="p-2 rounded bg-white text-black ml-2"
              placeholder="New Password"
              onChange={(e) => setPassword({ ...password, newPassword: e.target.value })}
            />
            <button className="ml-2 p-2 bg-green-500 text-white rounded" onClick={handlePasswordChange}>
              Update Password
            </button>
          </div>

          {/* Butoni për aktivizimin dhe çaktivizimin e njoftimeve */}
          <div>
            <label className="block text-white">Notifications:</label>
            {user.notifications ? (
              <button
                className="p-2 bg-red-500 text-white rounded"
                onClick={() => handleNotificationsChange(false)}
              >
                Turn Off Notifications
              </button>
            ) : (
              <button
                className="p-2 bg-green-500 text-white rounded"
                onClick={() => handleNotificationsChange(true)}
              >
                Turn On Notifications
              </button>
            )}
          </div>

          {/* Butoni për fshirjen e llogarisë */}
          <button className="p-2 bg-red-500 text-white rounded" onClick={handleDeleteAccount}>
            Delete Account
          </button>

          {/* Butoni për Toggle Theme */}
          <div className="mt-4">
            <button
              onClick={handleThemeChange}
              className="p-2 rounded-full bg-gray-600 hover:bg-gray-800 transition duration-300"
            >
              {theme === "dark" ? <FaMoon className="text-white" size={24} /> : <FaSun className="text-black" size={24} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
