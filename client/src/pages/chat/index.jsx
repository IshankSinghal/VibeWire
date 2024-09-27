import { useAppStore } from "@/store";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ContactsContainer from "./contacts-container";
import EmptyChatContainer from "./empty-chat-container";
import ChatContainer from "./chat-container";

const Chat = () => {
  const { userInfo } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userInfo) {
      toast("Please Setup User Profile.");
      navigate("/profile");
    }
  }, [userInfo, navigate]);

  return (
    <div className="flex h-[100vh] text-white overflow-hidden">
      <ContactsContainer />
      {/* <EmptyChatContainer /> */}
      {/* <ChatContainer /> */}
    </div>
  );
};

export default Chat;
