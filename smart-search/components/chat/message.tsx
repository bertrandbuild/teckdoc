"use client";

import { ChatMessage } from "./interfaces";
import Markdown from "react-markdown";
import styles from "./Message.module.css"
import { SearchIcon } from "lucide-react";

export interface MessageProps {
  message: ChatMessage;
}

const MessageUser = (props: ChatMessage) => {
  const { transactionHash, content } = props;
  return (
    <>
      <div className="avatar">
        <div className={`align-center flex size-8 justify-center rounded-full bg-slate-500 p-[4px]`}>
        <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500 dark:text-neutral-400" />
        </div>
      </div>
      <div
        className="userMessage"
        dangerouslySetInnerHTML={{
          __html: content.replace(
            /<(?!\/?br\/?.+?>|\/?img|\/?table|\/?thead|\/?tbody|\/?tr|\/?td|\/?th.+?>)[^<>]*>/gi,
            ""
          ),
        }}
      ></div>
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
  );
};

const ManagerMessage = (props: ChatMessage) => {
  const { content } = props;
  return (
    <>
      <div className="avatar">
        <div className={`mt-4 size-8 rounded-full bg-green-500`}>
          <img alt="avatar manager" src={'https://picsum.photos/200/300'} />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Markdown>{content}</Markdown>
      </div>
    </>
  );
};

const Message = (props: MessageProps) => {
  const { role } = props.message;
  const isUser = role === "user";

  return (
    <div className="message w-full">
      <div className={`text-secondary ${styles['markdown-container']}`}>
        {isUser ? (
          <MessageUser {...props.message} />
        ) : (
          <ManagerMessage {...props.message} />
        )}
      </div>
    </div>
  );
};

export default Message;