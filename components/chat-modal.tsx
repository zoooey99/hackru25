"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid"; // Import UUID library

function ChatBotModal({ onClose }: { onClose: () => void }) {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<string[]>([
    "👋 Hi! How can I assist you with inventory management?",
  ]);
  const [sessionId, setSessionId] = useState<string>("");

  // Generate session ID when the modal opens
  useEffect(() => {
    setSessionId(uuidv4()); // Generate a new session ID
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return; // Prevent empty messages

    const newMessage = `🧑‍💻 You: ${inputValue}`;
    setMessages((prev) => [...prev, newMessage]);

    try {
      const response = await fetch(
        "https://zoooey99.app.n8n.cloud/webhook-test/3f558856-03ac-46da-8c78-571042736499",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: inputValue,
            sessionId, // Send the session ID
          }),
        }
      );
      if (!response.ok) throw new Error("Network response was not ok");

      setMessages((prev) => [...prev, "🤖 Bot: Message received!"]); // Simulate response
    } catch (error) {
      console.error("Fetch error:", error);
      setMessages((prev) => [...prev, "❌ Error sending message"]);
    }

    setInputValue(""); // Clear input after sending
  };

  const handleEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-[400px] max-w-full p-4 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Chat Header */}
        <h2 className="text-xl font-bold text-primary mb-4">AI Assistant</h2>

        {/* Chat Messages */}
        <div className="h-60 border p-2 rounded-md overflow-y-auto text-sm text-gray-700">
          {messages.map((msg, index) => (
            <p key={index} className="mb-2">
              {msg}
            </p>
          ))}
        </div>

        {/* Chat Input & Send Button */}
        <div className="flex mt-3 gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-1 border rounded-md p-2 text-sm"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleEnterPress}
          />
          <Button onClick={handleSendMessage} className="bg-primary text-white px-4 py-2 rounded-md">
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ChatBotModal;
