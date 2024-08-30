import { useCallback, useEffect, useState } from "react"
import Image from "next/image"

import IaLogo from "../../public/ia.gif"
import useChat from "../chat/hook/useChat"
import { ChatMessage } from "../chat/interfaces"
import Message from "../chat/message"

export default function DialogIA({ searchedInput }: { searchedInput: string }) {
  const { startChat, requestHash, llmResult, setLlmResult } = useChat()
  const [loading, setLoading] = useState(false)

  const handleChatStart = useCallback(() => {
    if (searchedInput) {
      setLoading(true)
      startChat(searchedInput)
        .then((response: ChatMessage) => {
          setLlmResult(response)
          setLoading(false)
        })
        .catch((error) => {
          console.error("Error during chat:", error)
          setLoading(false)
        })
    }
  }, [searchedInput, setLlmResult, startChat])

  useEffect(() => {
  }, [llmResult]);

  return (
    <>
      <button
        onClick={handleChatStart}
        disabled={loading}
        className="flex cursor-pointer select-none items-center justify-between gap-2 rounded-xl px-4 py-2 transition-transform duration-200 ease-in-out hover:scale-105 hover:bg-gray-200 dark:hover:bg-gray-800"
      >
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
      </button>
      {requestHash && (
        <div className="flex w-full">
          <p className="text-primary mt-6 overflow-hidden text-ellipsis text-sm">
            Request Hash: {requestHash}
          </p>
        </div>
      )}
      {llmResult && <Message message={llmResult} />}
    </>
  )
}
