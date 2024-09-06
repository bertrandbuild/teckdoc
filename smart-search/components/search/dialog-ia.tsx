import { useContext, useEffect, useState } from "react"
import Image from "next/image"
import Web3AuthLogin from "@/components/web3auth/web3auth"

import IaLogo from "../../public/ia.gif"
import useChat from "../chat/hook/useChat"
import { ChatMessage } from "../chat/interfaces"
import Message from "../chat/message"
import { Loader } from "../loader"
import { GlobalContext } from "@/context/globalContext"
import { MAX_REQUESTS_LOGGED, MAX_REQUESTS_NOT_LOGGED } from "@/config/constant"
import { useWeb3Auth } from "../web3auth/web3auth-context"
import toast from "react-hot-toast";
import { Badge } from '@radix-ui/themes';
import { useRouter } from 'next/navigation'

export default function DialogIA({ searchedInput }: { searchedInput: string }) {
  const { startChat, requestHash, llmResult, setLlmResult } = useChat()
  const { updateContext, numberRequests } = useContext(GlobalContext)
  const { isLoggedIn } = useWeb3Auth()
  const isOverLimit = (!isLoggedIn && numberRequests >= MAX_REQUESTS_NOT_LOGGED) || (isLoggedIn && numberRequests >= MAX_REQUESTS_LOGGED)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const [items, setItems] = useState<any[]>([
    {
      href: "getting-started/installation",
      title: "Installation"
    },{
      href: "getting-started/quick-start-guide",
      title: "Quick Start Guide"
    },
  ])

  const handleChatStart = () => {
    if (isOverLimit) {
      console.error("You have reached your AI query limit")
      toast.error("You have reached your AI query limit. Login for more.")
      return
    }
    if (searchedInput) {
      setLoading(true)
      startChat(searchedInput)
        .then((response: ChatMessage) => {
          updateContext("numberRequests", numberRequests + 1)
          setLlmResult(response)
          setLoading(false)
        })
        .catch((error) => {
          console.error("Error during chat:", error)
          setLoading(false)
        })
    }
  }

  useEffect(() => {
    if (llmResult) {
      setLoading(false)
    }
  }, [llmResult]);

  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <div className="flex flex-col">
          <div className="mb-2 ml-auto mr-4">
            <Web3AuthLogin />
          </div>
          <button
            onClick={handleChatStart}
            disabled={loading}
            className="flex cursor-pointer select-none items-center justify-between gap-2 rounded-xl px-4 py-2 transition-transform duration-200 ease-in-out hover:scale-105 hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <div className="flex w-full items-center">
              <Image
                src={IaLogo}
                alt="Robot"
                width={40}
                height={40}
                className="mr-4 inline-block"
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
          </button>
        </div>
      )}
      <div className="ml-8">
        {requestHash && (
          <div className="flex w-full">
            <p className="text-primary mt-6 overflow-hidden text-ellipsis text-sm">
              Request Hash: <a className="text-blue-500 hover:text-blue-600" href={`https://explorer.galadriel.com/tx/${requestHash}`} target="_blank" rel="noopener noreferrer">{requestHash.slice(0, 6)}...{requestHash.slice(-4)}</a>
            </p>
          </div>
        )}
        <div className="mt-2">
          {llmResult && <Message message={llmResult} />}
          {llmResult && <div className="mt-2 flex flex-row">
            {items && items.map((item) => (
              <Badge
                color="indigo" radius="large"
                className="cursor-pointer mr-2 p-2 hover:bg-indigo-100"
                style={{ padding: '1px 5px', borderRadius: '5px' }}
                onClick={() => {
                  updateContext("isSearchOpen", false);
                  router.push(`/docs/${item.href}`);
                }}
              >
                {item.title}
              </Badge>
            ))}
          </div>}
        </div>
      </div>
    </>
  )
}
