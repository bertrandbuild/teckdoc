"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { buttonVariants } from "@/components/ui/button"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = (event: React.FocusEvent<HTMLFormElement>) => {
    event.preventDefault()

    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD

    if (email === adminEmail && password === adminPassword) {
      localStorage.setItem("userEmail", email)

      router.push("/admin")
    } else {
      setError("Invalid email or password")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="mb-6 text-2xl font-bold">Login</h1>
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm p-4 shadow-md"
      >
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-500 dark:border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-400"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-700 dark:border-gray-400 rounded-md shadow-sm"
            required
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className={buttonVariants({ variant: "default" })}
        >
          Login
        </button>
      </form>
    </div>
  )
}
