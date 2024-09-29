import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";
import EmojiPicker, { Emoji } from "emoji-picker-react";
import { useAppStore } from "@/store";
import { useSocket } from "@/context/cocketContext.jsx";

const MessageBar = () => {
  const emojiRef = useRef();
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [message, setMessage] = useState("");
  const { selectedChatType, selectedChatData, userInfo } = useAppStore();
  const socket = useSocket();

  const handleSendMessage = async () => {
    if (selectedChatType === "contacts") {
      socket.emit("sendMessage", {
        sender: userInfo.id,
        content: message,
        recipient: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      });
      setMessage("");
    }
  };

  useEffect(() => {
    function handleOutsideClick(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [emojiRef]);

  const handleEmojiPicker = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };

  return (
    <div className=" h-[10vh] bg-[#1c1d25] flex items-center justify-center px-6 mb-5 gap-6 ">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
        <input
          placeholder="Type Message"
          type="text"
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none "
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button className=" text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
          <GrAttachment className="text-2xl" />
        </button>
        <div className="relative">
          <button
            className=" text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={() => setEmojiPickerOpen(true)}
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>
          <div className="absolute bottom-16 right-0" ref={emojiRef}>
            <EmojiPicker
              theme="dark"
              open={emojiPickerOpen}
              onEmojiClick={handleEmojiPicker}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>
      <button
        className=" flex items-center justify-center bg-[#8417ff] rounded-md p-5 hover:bg-[#741bda] 
        focus:bg-[#741bda] focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
        onClick={handleSendMessage}
        
      >
        <IoSend className="text-2xl" />
      </button>
    </div>
  );
};

export default MessageBar;
