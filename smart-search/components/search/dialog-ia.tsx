import IaLogo from "../../public/ia.gif"
import Image from "next/image"

export default function DialogIA({ searchedInput }: { searchedInput: string }) {
  return (
    <div className="flex cursor-pointer select-none items-center justify-between gap-2 rounded-xl px-4 py-2 transition-transform duration-200 ease-in-out hover:scale-105 hover:bg-gray-200 dark:hover:bg-gray-800">
      <div className="flex items-center gap-4">
        <Image
          src={IaLogo}
          alt="Robot"
          width={40}
          height={40}
          className="inline-block"
        />
        <div className="flex flex-col">
          <span className="break-all font-medium">
            <span className="text-gray-700 dark:text-gray-300">
              Can you tell me about{" "}
            </span>
            <span className="text-green-500 dark:text-green-400">
              {searchedInput}
            </span>
          </span>
          <span className="text-sm text-gray-500">
            Use AI to answer your question
          </span>
        </div>
      </div>
      <div className="size-5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-chevron-right text-transparent"
        >
          <path d="m9 18 6-6-6-6"></path>
        </svg>
      </div>
    </div>
  )
}
