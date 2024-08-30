"use client"

import { SearchIcon } from "lucide-react"
import Markdown from "react-markdown"

import { ChatMessage } from "./interfaces"
import styles from "./message.module.css"

export interface MessageProps {
  message: ChatMessage
}

const MessageUser = (props: ChatMessage) => {
  const { transactionHash, content } = props
  return (
    <>
      <div className="avatar">
        <div
          className={`align-center flex size-8 justify-center rounded-full bg-slate-500 p-[4px]`}
        >
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500 dark:text-neutral-400" />
        </div>
      </div>
      <div className="userMessage">
        <Markdown>{content}</Markdown>
      </div>
      {transactionHash && (
        <div className="flex items-center gap-4 pb-8 pt-2 text-sm">
          <div>
            Transaction hash:
            <a
              className="pl-2 underline"
              href={`https://explorer.galadriel.com/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {transactionHash}
            </a>
          </div>
        </div>
      )}
    </>
  )
}

const ManagerMessage = (props: ChatMessage) => {
  const { content } = props
  return (
    <>
      <div className="flex flex-col gap-4">
        <Markdown>{content}</Markdown>
      </div>
    </>
  )
}

const Message = (props: MessageProps) => {
  const { role } = props.message
  const isUser = role === "user"

  console.log("Message props:", props);
  
  return (
    <div className="message w-full">
      <div className={`text-secondary ${styles["markdown-container"]}`}>
        {isUser ? (
          <MessageUser {...props.message} />
        ) : (
          <ManagerMessage {...props.message} />
        )}
      </div>
    </div>
  )
}

export default Message
