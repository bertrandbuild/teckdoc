"use client"

import Link from "next/link"
import { GithubIcon, HexagonIcon } from "lucide-react"

import { page_routes } from "@/lib/routes-config"
import { SheetClose } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/theme-toggle"

import Anchor from "./anchor"
import { SheetLeftbar } from "./leftbar"
import Search from "./search/search"
import { buttonVariants } from "./ui/button"
import { useWeb3Auth } from "./web3auth/web3auth-context"
import { GlobalContext } from "@/context/globalContext"
import { useContext } from "react"

export const NAVLINKS = [
  {
    title: "Avail",
    slug: "avail",
    href: `/avail/introduction-to-avail`,
  },
  {
    title: "Blockless",
    slug: "blockless",
    href: `/blockless/welcome/welcome`,
  },
  {
    title: "Nillion",
    slug: "nillion",
    href: `/nillion${page_routes[0].href}`,
  },
  {
    title: "Admin",
    slug: "admin",
    href: `/admin`,
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
  const { isLoggedIn, isAdmin } = useWeb3Auth()
  const { updateContext } = useContext(GlobalContext)

  return (
    <>
      {NAVLINKS.map((item) => {
        if (item.title === "Admin" && (!isLoggedIn || !isAdmin)) {
          return null
        }

        const Comp = (
          <Anchor
            key={item.title + item.href}
            activeClassName="text-black dark:text-white font-semibold"
            absolute
            href={item.href}
            onClick={() => {
              updateContext("selectedDemo", item.slug);
              console.log(item.slug)
            }}
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
  const { isLoggedIn, web3auth, setProvider, setIsLoggedIn } = useWeb3Auth()

  const login = async () => {
    try {
      if (!web3auth) {
        console.error("Web3Auth is not initialized")
        return
      }
      const web3authProvider = await web3auth.connect() // Connect with Web3Auth
      setProvider(web3authProvider)
      setIsLoggedIn(true)
    } catch (error) {
      console.error("Login failed", error)
    }
  }

  const logout = async () => {
    try {
      if (!web3auth) {
        console.error("Web3Auth is not initialized")
        return
      }
      await web3auth.logout() // Logout in Web3Auth
      setProvider(null)
      setIsLoggedIn(false)
    } catch (error) {
      console.error("Logout failed", error)
    }
  }
  return (
    <>
      {isLoggedIn ? (
        <button
          onClick={logout}
          className={buttonVariants({ variant: "default" })}
        >
          Logout
        </button>
      ) : (
        <button
          onClick={login}
          className={buttonVariants({ variant: "default" })}
        >
          Login with Web3
        </button>
      )}
    </>
  )
}
