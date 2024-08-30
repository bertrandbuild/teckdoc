import { useState } from "react"
import { chatSearchAIABI } from "@/abis/chatSearchAI"
import { Contract, TransactionReceipt, ethers } from "ethers"

import { ChatMessage } from "../interfaces"

// Utiliser process.env pour accéder aux variables d'environnement
const walletPrivateKey = process.env.NEXT_PUBLIC_WALLET_PK
const contractAddress =
  process.env.NEXT_PUBLIC_OPEN_CHAT_SEARCH_CONTRACT_ADDRESS || ""

const useChat = () => {
  const [requestHash, setRequestHash] = useState<string | null>(null)
  const [llmResult, setLlmResult] = useState<ChatMessage | null>(null)

  function getChatId(receipt: TransactionReceipt, contract: Contract) {
    let chatId
    for (const log of receipt.logs) {
      try {
        const parsedLog = contract.interface.parseLog(log)
        if (parsedLog && parsedLog.name === "ChatCreated") {
          // Second event argument
          chatId = ethers.toNumber(parsedLog.args[1])
        }
      } catch (error) {
        // This log might not have been from your contract, or it might be an anonymous log
        console.error("Could not parse log:", log)
      }
    }
    return chatId
  }

  const startChat = async (prompt: string): Promise<ChatMessage> => {
    try {
      if (!walletPrivateKey) {
        throw new Error("Private key is not defined in environment variables")
      }

      const provider = new ethers.JsonRpcProvider(
        "https://devnet.galadriel.com"
      )
      const wallet = new ethers.Wallet(walletPrivateKey, provider)
      const signer = wallet
      const contract = new Contract(
        contractAddress || "",
        chatSearchAIABI,
        signer
      )
      const gasPrice = ethers.parseUnits("1", "gwei") // 1 Gwei
      const gasLimit = 5000000 // large gas limit 5,000,000

      const tx = await contract.startChat(prompt, {
        gasPrice: gasPrice,
        gasLimit: gasLimit,
      })

      console.log("Transaction sent:", tx);
      const receipt = await tx.wait()
      setRequestHash(receipt.hash)
      const chatId = getChatId(receipt, contract)
      console.log("Transaction receipt:", receipt);

      if (receipt && receipt.status && chatId) {
        console.log("Chat started with ID:", chatId);

        while (true) {
          console.log('Fetching message history for chat ID:', chatId);
          const newMessages: ChatMessage[] = await contract.getMessageHistoryContents(
            chatId
          )
          console.log('New messages fetched:', newMessages);

          if (newMessages && newMessages.length > 0) {
            const lastMessage = newMessages.at(-1)

            if (lastMessage && lastMessage.role === "assistant") {
              // const assistantMessage = newMessages.find(
              //   (msg) => msg.role === "assistant"
              // )
              let content: string | undefined;
              for (const message of newMessages) {
                const target_copy = JSON.parse(JSON.stringify(message));
                if (target_copy[0] === "assistant") {
                  if (process.env.IS_DEV) {
                    console.log(target_copy);
                    console.log(target_copy[1][0][1]);
                  }
                  content = target_copy[1][0][1];
                  break;
                }
              }
              if (content) return {
                content,
                role: "assistant",
                transactionHash: receipt.hash
              };
            }
          }
          await new Promise((resolve) => setTimeout(resolve, 2000));

          //     if (assistantMessage) {
          //       console.log("Assistant message received:", assistantMessage.content);
          //       return {
          //         content: assistantMessage.content,
          //         role: "assistant",
          //         transactionHash: receipt.hash,
          //       }
          //     }
          //   }
          // }
          // await new Promise((resolve) => setTimeout(resolve, 2000))
        }
      }
    } catch (error: any) {
      console.error(error)
      throw error
    }
    throw new Error("Failed to request llm result")
  }

  return {
    requestHash,
    setRequestHash,
    llmResult,
    setLlmResult,
    startChat,
  }
}

export default useChat
