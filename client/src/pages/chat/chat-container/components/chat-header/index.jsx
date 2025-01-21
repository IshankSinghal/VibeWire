import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store";
import { HOST } from "@/utils/constants";
import { RiCloseFill } from "react-icons/ri";
import { MdOutlineWallpaper } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const ChatHeader = () => {
  const fileInputRef = useRef();
  const handleSetWallpaperClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const { setWallpaper } = useAppStore();
  const handleSetWallpaperChange = async (event) => {
    try {
      const file = event.target.files[0];
      if (!file) {
        toast.error("Please select an image.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setWallpaper(reader.result);
        toast.success("Wallpaper set successfully.");
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error updating wallpaper:", error);
      toast.error("Failed to update wallpaper. Please try again.");
    }
  };
  const { closeChat, selectedChatData, selectedChatType } = useAppStore();

  return (
    <div className="h-[8vh] border-b-2 border-[#2f303b] bg-[#2f303b] flex items-center justify-between px-20">
      <div className="flex gap-5 items-center w-full justify-between">
        <div className="flex gap-3 items-center justify-center ">
          <div className="w-12 h-12 relative ">
            {selectedChatType === "contacts" ? (
              <Avatar className="h-12 w-12 rounded-full overflow-hidden ">
                {selectedChatData.image ? (
                  <AvatarImage
                    src={`${HOST}/${selectedChatData.image}`}
                    alt="profile"
                    className="object-cover h-full w-full bg-black "
                  />
                ) : (
                  <div
                    className={`uppercase h-12 w-12 text-3xl font-mono border-[1px] flex items-center justify-center rounded-full ${getColor(
                      selectedChatData.color
                    )}`}
                  >
                    {selectedChatData.firstName
                      ? selectedChatData.firstName.split("").shift()
                      : selectedChatData.email.split("").shift()}
                  </div>
                )}
              </Avatar>
            ) : (
              <div className="bg-white/80 h-10 w-10 ring-4 flex items-center justify-center rounded-full">
                <img src="/groupChatIcon.png" className="h-6 w-6 " />
              </div>
            )}
          </div>
          <div>
            {selectedChatType === "channel" && selectedChatData.name}
            {selectedChatType === "contacts" && selectedChatData.firstName
              ? `${selectedChatData.firstName} ${selectedChatData.lastName}`
              : selectedChatData.email}
          </div>
        </div>
        <div className="flex items-center justify-center gap-5">
          <button
            className=" text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={closeChat}
          >
            <RiCloseFill className="text-3xl" />
          </button>
          <button
            className=" text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={handleSetWallpaperClick}
          >
            <MdOutlineWallpaper className="text-2xl" />
          </button>
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={handleSetWallpaperChange}
            accept="image/*"
          />
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
