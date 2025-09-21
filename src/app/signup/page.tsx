"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth/auth_client";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<
    "AI_ENGINEER" | "RECRUITER" | "RESEARCHER" | "COMPANY_HR" | "ADMIN"
  >("AI_ENGINEER");
  const [avatar, setAvatar] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp.email({
        email,
        password,
        username: username || undefined,
        first_name: firstName,
        lastName,
        role,
        image: avatar || undefined, // Maps to avatar
        name: `${firstName} ${lastName}`, // Populate name for Better Auth
      });
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Sign-up error:", err);
      setError(err.message || "Sign-up failed. Please check your inputs.");
    }
  };

  const handleSocialSignUp = async (provider: "google" | "github") => {
    try {
      await signUp[provider]({
        role: "AI_ENGINEER", // Default role for OAuth
        first_name: "OAuth", // Default, prompt for completion later
        lastName: "User",
        name: "OAuth User",
      });
      router.push("/dashboard");
    } catch (err: any) {
      console.error(`${provider} sign-up error:`, err);
      setError(err.message || `Failed to sign up with ${provider}`);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md w-full max-w-md">
        <h2 className="mb-4 text-2xl font-bold">Sign Up</h2>
        {error && <p className="mb-4 text-red-500">{error}</p>}

        <form onSubmit={handleEmailSignUp} className="space-y-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium">
              Username (optional)
            </label>
            <input
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="avatar" className="block text-sm font-medium">
              Avatar URL (optional)
            </label>
            <input
              id="avatar"
              type="text"
              placeholder="Avatar URL"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as typeof role)}
              className="w-full p-2 border rounded"
              required
            >
              <option value="AI_ENGINEER">AI Engineer</option>
              <option value="RECRUITER">Recruiter</option>
              <option value="RESEARCHER">Researcher</option>
              <option value="COMPANY_HR">Company HR</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-6">
          <p className="text-center text-sm mb-4">Or sign up with:</p>
          <div className="space-y-2">
            <button
              onClick={() => handleSocialSignUp("google")}
              className="w-full p-2 text-white bg-red-500 rounded hover:bg-red-600"
            >
              Sign Up with Google
            </button>
            <button
              onClick={() => handleSocialSignUp("github")}
              className="w-full p-2 text-white bg-gray-800 rounded hover:bg-gray-900"
            >
              Sign Up with GitHub
            </button>
          </div>
        </div>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
