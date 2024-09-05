"use client";
import { useEffect, useState } from "react"
import Link from "next/link"
import { GithubIcon, HexagonIcon } from "lucide-react"

import { page_routes } from "@/lib/routes-config"
import { SheetClose } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/theme-toggle"

import Anchor from "./anchor"
import { SheetLeftbar } from "./leftbar"
import Search from "./search/search"
import { buttonVariants } from "./ui/button"

export const NAVLINKS = [
  {
    title: "Example",
    href: `/docs${page_routes[0].href}`,
  },
]

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 h-16 w-full border-b px-2 backdrop-blur-xl lg:px-4">
      <div className="mx-auto flex h-full max-w-[1530px] items-center justify-between gap-2 p-2 sm:p-3">
        <div className="flex items-center gap-5">
          <SheetLeftbar />
          <div className="flex items-center gap-8">
            <div className="hidden sm:flex">
              <Logo />
            </div>
            <div className="text-muted-foreground hidden items-center gap-5 text-sm font-medium lg:flex">
              <NavMenu />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Search />
            <div className="flex">
              <Link
                href="https://github.com/bertrandbuild/teckdoc"
                className={buttonVariants({ variant: "ghost", size: "icon" })}
              >
                <GithubIcon className="size-[1.1rem]" />
              </Link>
              <ModeToggle />
            </div>
          </div>
          <AuthMenu />
        </div>
      </div>
    </nav>
  )
}

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <HexagonIcon className="text-muted-foreground size-7 fill-current" />
      <h2 className="text-md font-bold">TeckDoc</h2>
    </Link>
  )
}

export function NavMenu({ isSheet = false }) {
  return (
    <>
      {NAVLINKS.map((item) => {
        const Comp = (
          <Anchor
            key={item.title + item.href}
            activeClassName="text-black dark:text-white font-semibold"
            absolute
            href={item.href}
          >
            {item.title}
          </Anchor>
        )
        return isSheet ? (
          <SheetClose key={item.title + item.href} asChild>
            {Comp}
          </SheetClose>
        ) : (
          Comp
        )
      })}
    </>
  )
}

export function AuthMenu() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const email = localStorage.getItem("userEmail")
    if (email) {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("userEmail") // Delete email when disconnected
    setIsAuthenticated(false)
  }

  return (
    <>
      {isAuthenticated ? (
        <button
          onClick={handleLogout}
          className={buttonVariants({ variant: "default" })}
        >
          Logout
        </button>
      ) : (
        <Link href="/login" className={buttonVariants({ variant: "default" })}>
          Login
        </Link>
      )}
    </>
  )
}
