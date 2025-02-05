import { useEffect, useRef, useState } from "react";
import { GrAttachment } from "react-icons/gr";
import { IoSend } from "react-icons/io5";
import { RiEmojiStickerLine } from "react-icons/ri";
import EmojiPicker, { Emoji } from "emoji-picker-react";
import { useAppStore } from "@/store";
import { useSocket } from "@/context/cocketContext.jsx";
import { apiClient } from "@/lib/api-client";
import { UPLOAD_FILE_ROUTE } from "@/utils/constants";

const MessageBar = () => {
  const emojiRef = useRef();
  const fileInputRef = useRef();
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [message, setMessage] = useState("");
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    setIsUploading,
    setFileUploadProgress,
  } = useAppStore();
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
    } else if (selectedChatType === "channel") {
      socket.emit("send-channel-message", {
        sender: userInfo.id,
        content: message,
        channelId: selectedChatData._id,
        messageType: "text",
        fileUrl: undefined,
      });
    }
    setMessage("");
  };

  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAttachmentChange = async (event) => {
    try {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        setIsUploading(true);
        const response = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
          withCredentials: true,
          onUploadProgress: (data) => {
            setFileUploadProgress(Math.round((100 * data.loaded) / data.total));
          },
        });

        if (response.status === 200 && response.data) {
          setIsUploading(false);
          if (selectedChatType === "contacts") {
            socket.emit("sendMessage", {
              sender: userInfo.id,
              content: undefined,
              recipient: selectedChatData._id,
              messageType: "file",
              fileUrl: response.data.filePath,
            });
          } else if (selectedChatType === "channel") {
            socket.emit("send-channel-message", {
              sender: userInfo.id,
              content: undefined,
              channelId: selectedChatData._id,
              messageType: "file",
              fileUrl: response.data.filePath,
            });
          }
          setMessage("");
        }
      }
      console.log({ file });
    } catch (error) {
      setIsUploading(false);
      console.log(error);
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
    <div className=" h-[8vh] bg-[#1c1d25] flex items-center justify-center px-6 gap-3 ">
      <div className="h-[6vh] flex-1 flex bg-[#2a2b33] rounded-full items-center gap-4 pr-5 ">
        <input
          placeholder="Type Message"
          type="text"
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none "
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className=" text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
          onClick={handleAttachmentClick}
        >
          <GrAttachment className="text-2xl" />
        </button>
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleAttachmentChange}
        />
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
        className="h-[5vh] flex items-center justify-center bg-[#8417ff] rounded-full p-5 hover:bg-[#741bda] 
        focus:bg-[#741bda] focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
        onClick={handleSendMessage}
      >
        <IoSend className="text-2xl" />
      </button>
    </div>
  );
};

export default MessageBar;
