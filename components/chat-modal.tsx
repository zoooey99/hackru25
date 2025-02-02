"use client"

import { useState, useEffect } from "react"
import { Send, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { v4 as uuidv4 } from "uuid"
import ReactMarkdown from "react-markdown"
import { motion, AnimatePresence } from "framer-motion"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
}

function LoadingDots() {
  return (
    <div className="flex space-x-2 p-3 bg-muted rounded-lg">
      <motion.div
        className="w-2 h-2 bg-gray-500 rounded-full"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
      />
      <motion.div
        className="w-2 h-2 bg-gray-500 rounded-full"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 0.1 }}
      />
      <motion.div
        className="w-2 h-2 bg-gray-500 rounded-full"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 0.2 }}
      />
    </div>
  )
}

function ChatBotModal({ onClose }: { onClose: () => void }) {
  const [inputValue, setInputValue] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    { id: uuidv4(), content: "Hi! How can I assist you with inventory management?", sender: "bot" },
  ])
  const [sessionId, setSessionId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setSessionId(uuidv4())
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const newMessage: Message = { id: uuidv4(), content: inputValue, sender: "user" }
    setMessages((prev) => [...prev, newMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      const response = await fetch("https://zoooey99.app.n8n.cloud/webhook/3f558856-03ac-46da-8c78-571042736499", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputValue,
          sessionId,
        }),
      })

      if (!response.ok) throw new Error("Network response was not ok")

      const data = await response.json()
      console.log(data.message)
      setMessages((prev) => [...prev, { id: uuidv4(), content: data.output, sender: "bot" }])
    } catch (error) {
      console.error("Fetch error:", error)
      setMessages((prev) => [...prev, { id: uuidv4(), content: "Error sending message", sender: "bot" }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-hidden"
      >
        <Card className="w-[800px] max-w-[90vw] h-[90vh] flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">AI Assistant</CardTitle>
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>
          <CardContent className="flex-grow overflow-hidden">
            <motion.div
              className="h-[calc(90vh-180px)] overflow-y-auto pr-4 space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} mb-4`}
                >
                  <div
                    className={`flex ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"} items-start max-w-[80%]`}
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={
                          msg.sender === "user"
                            ? "/placeholder.svg?height=32&width=32"
                            : "/placeholder.svg?height=32&width=32"
                        }
                      />
                      <AvatarFallback>{msg.sender === "user" ? "U" : "AI"}</AvatarFallback>
                    </Avatar>
                    <div
                      className={`mx-2 p-3 rounded-lg ${
                        msg.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      {msg.sender === "bot" ? (
                        <ReactMarkdown className="prose prose-sm max-w-none dark:prose-invert">
                          {msg.content}
                        </ReactMarkdown>
                      ) : (
                        <p>{msg.content}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex justify-start mb-4"
                >
                  <div className="flex flex-row items-start max-w-[80%]">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="mx-2">
                      <LoadingDots />
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </CardContent>
          <CardFooter>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendMessage()
              }}
              className="flex w-full items-center space-x-2"
            >
              <Input
                type="text"
                placeholder="Type your message..."
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleEnterPress}
                className="flex-grow"
              />
              <Button type="submit" size="icon" disabled={isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}

export default ChatBotModal

