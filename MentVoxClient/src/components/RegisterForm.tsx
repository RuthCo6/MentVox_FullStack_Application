import React, { useState } from "react";
import { register } from "../components/Api";

export default function RegisterForm() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await register(userName, password, email);
      alert("🎉 Registration successful!");
    } catch (err) {
      console.error(err);
      alert("😬 Registration failed. Check console for details.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <button type="submit">Register</button>
    </form>
  );
}
