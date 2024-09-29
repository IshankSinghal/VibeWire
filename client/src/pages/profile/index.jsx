import { useAppStore } from "@/store";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { IoArrowBack } from "react-icons/io5";
import { FaTrash, FaPlus } from "react-icons/fa";
import { IconBase } from "react-icons";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { colors, getColor } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api-client";
import {
  HOST,
  UPDATE_PROFILE_ROUTE,
  ADD_PROFILE_IMAGE_ROUTE,
  DELETE_PROFILE_IMAGE_ROUTE,
} from "@/utils/constants";

const Profile = () => {
  const navigate = useNavigate();

  const { userInfo, setUserInfo } = useAppStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hover, sethover] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (userInfo.profileSetup) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color);
      if (userInfo.image) {
        setImage(`${HOST}/${userInfo.image}`);
      }
    }
  }, [userInfo]);

  const validateProfile = () => {
    if (!firstName) {
      toast.error("First Name is required.");
      return false;
    }
    if (!lastName) {
      toast.error("Last Name is required.");
      return false;
    }
    return true;
  };

  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        console.log(firstName, lastName,selectedColor)
        const response = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          { firstName, lastName, color: selectedColor },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data) {
          setUserInfo({ ...response.data });
          toast.success("Profile Updated Successfully!");
          navigate("/chat");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Please Complete the Profile");
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  //UNDERSTAND THIS
  const handleUpdateProfilePic = async (event) => {
    try {
      const file = event.target.files[0];
      console.log({ file });
      if (file) {
        const formData = new FormData();
        formData.append("profile-image", file);
        const response = await apiClient.post(
          ADD_PROFILE_IMAGE_ROUTE,
          formData,
          {
            withCredentials: true,
          }
        );
        if (response.status === 200 && response.data.image) {
          setUserInfo({ ...userInfo, image: response.data.image });
          toast.success("Image Updated Successfully!");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteProfilePic = async () => {
    try {
      const response = await apiClient.delete(DELETE_PROFILE_IMAGE_ROUTE, {
        withCredentials: true,
      });

      if (response.status === 200) {
        setUserInfo({ ...userInfo, image: null });
        toast.success("Image Removed Successfully.");
        setImage(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max  ">
        <div>
          <div onClick={handleNavigate}>
            <IoArrowBack className="text-4xl lg:text-6xl text-white/90 cursor-pointer transition-all duration-300 hover:scale-125" />
          </div>
          <div className="grid grid-cols-2 ">
            <div
              className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center "
              onMouseEnter={() => sethover(true)}
              onMouseLeave={() => sethover(false)}
            >
              <Avatar className="h-32 w-32 md:h-48 md:w-48 rounded-full overflow-hidden ">
                {image ? (
                  <AvatarImage
                    src={image}
                    alt="profile"
                    className="object-cover h-full w-full bg-black "
                  />
                ) : (
                  <div
                    className={`uppercase h-32 w-32 md:h-48 md:w-48 text-7xl font-mono border-[1px] flex items-center justify-center rounded-full ${getColor(
                      selectedColor
                    )}`}
                  >
                    {firstName
                      ? firstName.split("").shift()
                      : userInfo.email.split("").shift()}
                  </div>
                )}
              </Avatar>
              {hover && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full cursor-pointer"
                  onClick={
                    image ? handleDeleteProfilePic : handleFileInputClick
                  }
                >
                  {image ? (
                    <FaTrash className="text-white text-3xl cursor-pointer" />
                  ) : (
                    <FaPlus className="text-white text-3xl cursor-pointer" />
                  )}
                </div>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleUpdateProfilePic}
                name="profile-image"
                accept=".png, .jpg, .jpeg, .svg, .webp"
              />
            </div>
            <div className="flex min-w-32 mid:min-w-64 flex-col gap-5 text-white items-center justify-center ">
              <div className=" w-full">
                <Input
                  placeholder="Email:"
                  type="email"
                  disabled
                  value={userInfo.email}
                  className=" rounded-2xl p-6 bg-[#2c2e3b] border-none"
                />
              </div>
              <div className=" w-full">
                <Input
                  placeholder="First Name"
                  type="text"
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                  className="text-lg rounded-2xl p-6 bg-[#2c2e3b] border-none"
                />
              </div>
              <div className=" w-full">
                <Input
                  placeholder="Last Name"
                  type="text"
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
                  className="text-lg rounded-2xl p-6 bg-[#2c2e3b] border-none"
                />
              </div>
              <div className="w-full flex gap-5">
                {colors.map((color, index) => (
                  <div
                    className={`${color} h-8 w-12 rounded-full cursor-pointer 
                  transition-all duration-300 hover:scale-125 
                  ${selectedColor === index ? "ring ring-white" : ""} `}
                    key={index}
                    onClick={() => setSelectedColor(index)}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full">
          <Button
            className="h-16 w-full bg-purple-700 hover:bg-purple-700 rounded-3xl transition-all duration-300 font-semibold text-xl
            transform hover:scale-105 shadow-lg"
            onClick={saveChanges}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
