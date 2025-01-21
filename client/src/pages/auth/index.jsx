import Background from "@/assets/login2.png";
import Victory from "@/assets/victory.svg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Auth = () => {
  const navigate = useNavigate();
  const { setUserInfo } = useAppStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const validateSignUp = () => {
    if (!email.length) {
      toast.error("Email is Required.");
      return false;
    }
    if (!password.length) {
      toast.error("Password is Required.");
      return false;
    }
    if (password != confirmPassword) {
      toast.error(" Password and Confirm Password not matching.");
      return false;
    }
    return true;
  };

  const validateLogIn = () => {
    if (!email.length) {
      toast.error("Email is Required.");
      return false;
    }
    if (!password.length) {
      toast.error("Password is Required.");
      return false;
    }
    return true;
  };

  const handleLogIn = async () => {
    if (validateLogIn()) {
      const response = await apiClient.post(
        LOGIN_ROUTE,
        { email, password },
        { withCredentials: true }
      );
      if (response.data.user.id) {
        setUserInfo(response.data.user);
        if (response.data.user.profileSetup) {
          navigate("/chat");
        } else {
          navigate("/profile");
        }
      }
      console.log({ response });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleLogIn(); // Trigger log in on Enter key press
    }
  };

  const handleSignUp = async () => {
    if (validateSignUp()) {
      const response = await apiClient.post(
        SIGNUP_ROUTE,
        { email, password },
        { withCredentials: true }
      );
      setUserInfo(response.data.user);
      if (response.status === 201) {
        navigate("/profile");
      }
      console.log({ response });
    }
  };

  return (
    <div className="flex items-center justify-center bg-[url(/bg-auth2.jpg)] bg-cover relative h-[100vh] w-[100vw] ">
      <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-lg flex items-center justify-center ">
        <div className="relative z-10 h-[70vh] text-opacity-90 border-2 shadow-2xl w-[50vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-2xl fle items-center justify-center ">
          <div className="p-32 flex flex-col gap-10 items-center justify-center">
            <div className="flex items-center justify-center flex-col">
              <div className="flex items-center justify-center">
                <h1 className="text-5xl  md:text-6xl text-white/85">WELCOME</h1>
                <img src={Victory} alt="Victory Emoji" className="h-[100px]" />
              </div>
              <p className="font-medium text-lg text-center text-white/85">
                Fill up 'n' <i>VIBE</i>!!!
              </p>
            </div>
            <div className="flex items-center justify-center w-full ">
              <Tabs className="w-3/4 " defaultValue="Log In">
                <TabsList className="bg-transparent rounded-none w-full">
                  <TabsTrigger
                    value="Log In"
                    className="data-[state=active]:rounded-md text-white/85 text-opacity-100 
                  rounded-none data-[state=active]: font-semibold w-full  transition-all duration-300 shadow-md "
                  >
                    Log In
                  </TabsTrigger>
                  <TabsTrigger
                    value="Sign Up"
                    className="data-[state=active]:rounded-md text-white/85 text-opacity-100 
                  rounded-none data-[state=active]: font-semibold w-full  transition-all duration-300 shadow-md"
                  >
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <TabsContent
                  value="Log In"
                  className="flex flex-col mt-10 gap-5 items-center"
                >
                  <Input
                    placeholder="Email"
                    type="email"
                    className=" rounded-2xl p-6 "
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    placeholder="Password"
                    type="password"
                    className=" rounded-2xl p-6"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Button
                    className="rounded-2xl w-56"
                    onClick={handleLogIn}
                    onKeyDown={handleKeyDown}
                    tabIndex="0"
                  >
                    {" "}
                    Log In
                  </Button>
                </TabsContent>

                <TabsContent
                  value="Sign Up"
                  className="flex flex-col gap-5 items-center"
                >
                  <Input
                    placeholder="Email"
                    type="email"
                    className=" rounded-2xl p-6"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Input
                    placeholder="Password"
                    type="password"
                    className=" rounded-2xl p-6"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <Input
                    placeholder="ConfirmPassword"
                    type="confirmpassword"
                    className=" rounded-2xl p-6"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <Button
                    className="rounded-2xl w-56"
                    onClick={handleSignUp}
                    onKeyDown={handleKeyDown}
                    tabIndex="0"
                  >
                    {" "}
                    Sign Up
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
