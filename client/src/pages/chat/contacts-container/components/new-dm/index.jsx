import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { animationDefaultOPtions, getColor } from "@/lib/utils";
import Lottie from "react-lottie";
import { apiClient } from "@/lib/api-client";
import { HOST, SEARCH_CONTACT } from "@/utils/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";

const NewDm = () => {
  const [openNewContactModal, setOpenNewContactModal] = useState(false);
  const [serchedContacts, setSerchedContacts] = useState([]);
  const { setSelectedChatType, setSelectedChatData } = useAppStore();

  const searchContacts = async (searchTerm) => {
    try {
      if (searchTerm.length > 0) {
        const res = await apiClient.post(
          SEARCH_CONTACT,
          { searchTerm },
          { withCredentials: true }
        );
        if (res.status === 200 && res.data.contacts) {
          console.log(res.data.contacts);
          setSerchedContacts(res.data.contacts);
        }
      } else {
        setSerchedContacts([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const selectNewContact = (contacts) => {
    setOpenNewContactModal(false);
    setSelectedChatType("contacts");
    setSelectedChatData(contacts);
    setSerchedContacts([]);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <FaPlus
              className="text-neutral-400 font-light text-opacity-90 text-start
            hover:text-neutral-100 hover:scale-110 cursor-pointer transition-all duration-300"
              onClick={() => setOpenNewContactModal(true)}
            />
          </TooltipTrigger>
          <TooltipContent className="bg-[#1c1b1e] border-none text-white">
            <p>Add Contact</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col ">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-center">
              Please Select a contact
            </DialogTitle>
          </DialogHeader>
          <div>
            <Input
              placeholder="Search Contact"
              className="rounded-lg p-6 bg-[#2c2e3b] border-none"
              onChange={(e) => searchContacts(e.target.value)}
            />
          </div>
          {serchedContacts.length > 0 && (
            <ScrollArea className="h-[250px]">
              <div className="flex flex-col gap-5">
                {serchedContacts.map((contacts) => (
                  <div
                    key={contacts._id}
                    className="flex gap-3 items-center cursor-pointer"
                    onClick={() => selectNewContact(contacts)}
                  >
                    <div className="w-12 h-12 relative ">
                      <Avatar className="h-12 w-12 rounded-full overflow-hidden ">
                        {contacts ? (
                          <AvatarImage
                            src={`${HOST}/${contacts.image}`}
                            alt="profile"
                            className="object-cover h-full w-full bg-black rounded-full"
                          />
                        ) : (
                          <div
                            className={`uppercase h-12 w-12 text-3xl font-mono border-[1px] flex items-center justify-center rounded-full ${getColor(
                              contacts.color
                            )}`}
                          >
                            {contacts.firstName
                              ? contacts.firstName.split("").shift()
                              : contacts.email.split("").shift()}
                          </div>
                        )}
                      </Avatar>
                    </div>
                    <div className="flex flex-col">
                      <span>
                        {contacts.firstName && contacts.lastName
                          ? `${contacts.firstName} ${contacts.lastName}`
                          : contacts.email}
                      </span>
                      <span>
                        <div className="text-xs">{contacts.email}</div>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
          {serchedContacts.length == 0 && (
            <div className="flex-1  rounded-md md:flex md:mt-0 flex-col items-center justify-center duration-1000 transition-all mt-5">
              <Lottie
                isClickToPauseDisabled={true}
                height={100}
                width={100}
                options={animationDefaultOPtions}
              />
              <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-2xl text-xl transition-all duration-300 text-center">
                <h3 className="poppins-medium ">
                  Hi<span className="text-purple-500">! </span>Search New
                  Contacts.
                </h3>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDm;
