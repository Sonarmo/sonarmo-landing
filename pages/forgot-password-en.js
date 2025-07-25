import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../lib/firebase";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent. Please check your inbox.");
    } catch (err) {
      console.error("Reset error:", err);
      setError("Unable to send reset email. Please check the address.");
    }
  };

  return (
    <>
      <Head>
        <title>Sonarmo - Forgot Password</title>
        <link rel="icon" href="/sonarmo-experience.png" type="image/png" />
      </Head>
      <main className="min-h-screen bg-black text-white px-4 flex flex-col">
        
        {/* Header with logo on the left */}
        <header className="w-full flex justify-start p-4">
          <Link href="/index-en" className="flex items-center gap-2">
            <Image src="/sonarmo-experience.png" alt="Sonarmo Logo" width={32} height={32} />
            <span className="text-white font-semibold italic hidden sm:inline">Sonarmo</span>
          </Link>
        </header>

        {/* Form section */}
        <div className="flex-grow flex items-center justify-center">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold mb-6 text-center">Reset your password</h1>
            <form onSubmit={handleReset} className="flex flex-col gap-4">
              <label className="text-sm">Email address
                <input
                  type="email"
                  className="w-full px-4 py-2 mt-1 bg-white text-black rounded"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              {message && <p className="text-green-400 text-sm">{message}</p>}
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button type="submit" className="bg-gradient-to-r from-[#F28500] to-[#FF00FF] text-white py-2 px-4 rounded">
                Send reset link
              </button>
              <Link href="/login-en" className="text-sm text-gray-400 hover:text-white text-center">
                Back to login
              </Link>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}