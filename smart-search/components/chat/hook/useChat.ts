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

  // Prefix the prompt to request validation from the AI
  const buildValidationPrompt = (userPrompt: string): string => {
    const forbiddenContentChecklist = [
      "insults",
      "discriminatory remarks",
      "hate speech",
      "sexually explicit content",
      "spam",
      "fraud or scams",
      "illegal propositions",
      "phishing",
      "misleading content",
      "harassment",
      "copyright violations",
      "privacy violations",
      "false information",
    ]

    const checklist = forbiddenContentChecklist.join(", ")
    return `Is this request legitimate: "${userPrompt}"? Please ensure the request does not contain the following: ${checklist}. Answer with either yes or no.`
  }

  // Validate prompt user
  const validateRequest = async (prompt: string): Promise<boolean> => {
    try {
      if (!walletPrivateKey) throw new Error("Private key is missing")

      const provider = new ethers.JsonRpcProvider(
        "https://devnet.galadriel.com"
      )
      const wallet = new ethers.Wallet(walletPrivateKey, provider)
      const contract = new Contract(
        contractAddress || "",
        chatSearchAIABI,
        wallet
      )

      const validationPrompt = buildValidationPrompt(prompt)

      const tx = await contract.startChat(validationPrompt, {
        gasPrice: ethers.parseUnits("1", "gwei"),
        gasLimit: 5000000,
      })

      const receipt = await tx.wait()
      const chatId = getChatId(receipt, contract)

      if (receipt.status && chatId) {
        for (let i = 0; i < 20; i++) {
          // Limite à 20 tentatives max
          const newMessages: ChatMessage[] = await contract.getMessageHistory(
            chatId
          )

          if (newMessages.length > 0) {
            const lastMessage = newMessages.at(-1)

            if (lastMessage && lastMessage.role === "assistant") {

              for (const message of newMessages) {
                const target_copy = JSON.parse(JSON.stringify(message))
                const llmReturnedValue = target_copy[1][0][1]
                  .trim()
                  .toLowerCase()

                  if (llmReturnedValue === "yes") {
                  return true
                } else if (llmReturnedValue === "no") {
                  return false
                }
              }
            }
          }
          // Attendre 2 secondes avant de réessayer
          await new Promise((resolve) => setTimeout(resolve, 2000))
        }
      }
    } catch (error) {
      console.error("Error during validation:", error)
    }
    return false
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

      // Verification requets (prompt user)
      const isValid = await validateRequest(prompt)
      if (!isValid) {
        console.error("Request invalid.")
        return { content: "Request invalid, please change your message!", role: "assistant", transactionHash: "" }
      }

      const tx = await contract.startChat(prompt, {
        gasPrice: gasPrice,
        gasLimit: gasLimit,
      })

      const receipt = await tx.wait()
      setRequestHash(receipt.hash)
      const chatId = getChatId(receipt, contract)

      if (receipt && receipt.status && chatId) {
        while (true) {
          const newMessages: ChatMessage[] = await contract.getMessageHistory(
            chatId
          )

          if (newMessages && newMessages.length > 0) {
            const lastMessage = newMessages.at(-1)

            if (lastMessage && lastMessage.role === "assistant") {
              let content: string | undefined
              for (const message of newMessages) {
                const target_copy = JSON.parse(JSON.stringify(message))
                if (target_copy[0] === "assistant") {
                  if (process.env.NEXT_PUBLIC_IS_DEV) {
                    console.log(target_copy)
                    console.log(target_copy[1][0][1])
                  }
                  content = target_copy[1][0][1]
                  break
                }
              }
              if (content)
                return {
                  content,
                  role: "assistant",
                  transactionHash: receipt.hash,
                }
            }
          }
          await new Promise((resolve) => setTimeout(resolve, 2000))
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
