"use client"

import { Button } from "@/components/ui/button"
import { GlobalContext } from "@/context/globalContext"
import { SearchIcon } from "lucide-react"
import Link from "next/link"
import { useContext } from "react"

export default function IndexPage() {
  const { updateContext } = useContext(GlobalContext)

  const handleOpenSearch = () => {
    updateContext("isSearchOpen", true)
  }

  return (
    <div className="flex min-h-[88vh] flex-col items-center justify-center px-2 py-8 text-center sm:min-h-[91vh]">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="mb-4 text-3xl font-bold sm:text-7xl">
          Welcome to the documentation page.
        </h1>
      </div>
      <div className="flex flex-row items-center gap-5">
        <Link
          href="https://github.com/bertrandbuild/template-next-web3"
          target="_blank"
          className="mb-5 flex items-center gap-2 underline underline-offset-4 sm:text-lg"
        >
          Follow along on GitHub{" "}
        </Link>
      </div>
      <Button onClick={handleOpenSearch}>
        <SearchIcon className="mr-2 size-4" />
        Open Search
      </Button>
    </div>
  )
}
