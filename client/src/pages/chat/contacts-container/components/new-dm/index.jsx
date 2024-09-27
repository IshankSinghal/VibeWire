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
import { animationDefaultOPtions } from "@/lib/utils";
import Lottie from "react-lottie";

const NewDm = () => {
  const [openNewContactModal, setOpenNewContactModal] = useState(false);
  const [serchedContacts, setSerchedContacts] = useState([]);

  const searchContacts = async (searchTerm) => {};

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
          {serchedContacts.length == 0 && (
            <div className="flex-1 md:bg-[#1c1d25] rounded-md md:flex flex-col items-center justify-center duration-1000 transition-all mt-5">
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
