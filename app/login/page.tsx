"use client";

import { socket } from "@/lib/socket";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");

    if (!username || !password) {
      setError("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:3001/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // ===========================
      // SAVE JWT
      // ===========================
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);

      // ===========================
      // UPDATE SOCKET TOKEN
      // ===========================
      socket.auth = {
        token: data.token,
      };

      // reconnect with JWT
      if (socket.connected) {
        socket.disconnect();
      }

      socket.connect();

      console.log("✅ Logged in");
      console.log("JWT:", data.token);

      router.push("/messages");
    } catch (err) {
      console.error(err);
      setError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Secure Messenger
          </h1>

          <p className="text-gray-500 mt-2">
            Login to continue
          </p>
        </div>

        <div className="space-y-5">

          <div>
            <label className="block text-sm font-medium mb-2">
              Username
            </label>

            <input
              type="text"
              value={username}
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLogin();
              }}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <button
            disabled={loading}
            onClick={handleLogin}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg"
          >
            {loading ? "Signing In..." : "Login"}
          </button>

          <button
            onClick={() => router.push("/register")}
            className="w-full border py-3 rounded-lg"
          >
            Create Account
          </button>

        </div>
      </div>
    </main>
  );
}