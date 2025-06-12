"use client";
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Navbar from "../helpers/Navbar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";
import { Lancelot } from "next/font/google";
import { signIn, useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "../helpers/Footer";
import { LockClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { FaEyeSlash, FaRegEyeSlash } from "react-icons/fa";
import { Modal } from "../helpers/Modal";

const lancelot = Lancelot({ subsets: ["latin"], weight: ["400"] });

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(7).required("Password is required"),
});

export default function Page() {
  const router = useRouter();
  const { data: session } = useSession();
  const [pass, showPass] = useState(false);
  const [error,setError] = useState();
  const [isDialogOpen,setIsDialogOpen] = useState(false)
  if (session) {
    router.push("/user");
  }

  const authMethods = [
    {
      method: "google",
      icon: "https://static-00.iconduck.com/assets.00/google-icon-512x512-wk1c10qc.png",
    },
    {
      method: "github",
      icon: "https://static-00.iconduck.com/assets.00/github-icon-2048x2048-qlv5m092.png",
    },
  ];

  const handleProviderSignIn = async (values) => {
    try {
      const res = await fetch("http://localhost:5000/login", {  
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: values.email }),
      });
  
      const userData = await res.json();
  
      if (userData?.provider === "google") {
        setError("You signed up using Google. Please log in with Google.");
        setIsDialogOpen(true);
        return;
      }
  
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
        callbackUrl: "/user",
      });
  
      if (result?.error) {
        setError("Invalid email or password.");
        setIsDialogOpen(true);
      }
    } catch (error) {
      setError("Something went wrong. Please try again later.");
      setIsDialogOpen(true);
    }
  };
  

  return (
    <div>
        <Navbar />

      <div className="">
        <img
          src="https://repository-images.githubusercontent.com/275336521/20d38e00-6634-11eb-9d1f-6a5232d0f84f"
          className="h-full  w-full object-cover brightness-50"
          alt="MovieDB Hero"
        />
      </div>
        <Modal isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} errormsg={error}/>
    
      <div className="absolute top-10 w-full flex justify-center">
        <div className="crd pt-24 flex flex-col items-center px-4 sm:px-8 lg:px-0">
          <Card className="w-full max-w-lg bg-black/40 p-5 sm:p-7 md:p-10">
            <CardHeader>
              <CardTitle
                className={`${lancelot.className} text-red-500 text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl`}
              >
                MovieDB
              </CardTitle>
            </CardHeader>

            <CardContent>
              <Formik
                initialValues={{ email: "", password: "" }}
                validationSchema={LoginSchema}
                onSubmit={handleProviderSignIn}
              >
                <Form>
                  <div className="grid w-full items-center mt-10 text-white gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="email">Email</Label>
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        placeholder=""
                        className="flex h-9 w-full rounded-md bg-zinc-800/80 px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        className="text-red-500"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="password">Password</Label>
                     <div className="relative">
                     <Field
                        id="password"
                        name="password"
                        type={pass ? "text" : "password"}
                        placeholder=""
                        className="flex h-9 w-full rounded-md bg-zinc-800/80 px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      />
                      <span className="absolute right-3 cursor-pointer top-3 text-gray-400" onClick={() => showPass(!pass)}>{pass ? <FaRegEyeSlash  onClick={()=>{showPass(false)}}/>:<EyeOpenIcon onClick={()=>{showPass(true)}}/>}</span>
                     </div>
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-red-500"
                      />
                     
                    </div>
                  </div>
                  <CardFooter className="flex w-full mt-10 flex-col text-white items-center">
                    <Button
                      variant="destructive"
                      type="submit"
                      className="w-full"
                    >
                      Sign In
                    </Button>

                    <p className="mt-5">OR</p>

                    <div className="flex gap-5 sm:gap-10 items-center mt-5">
                      {authMethods.map((auth, i) => (
                        <img
                          key={i}
                          onClick={() =>
                            signIn(auth.method, { callbackUrl: "/user/recom" })
                          }
                          width={50}
                          className="cursor-pointer hover:shadow-xl hover:shadow-white rounded-lg sm:w-[60px] md:w-[70px]"
                          src={auth.icon}
                          alt={auth.method}
                        />
                      ))}
                    </div>

                    <div className="links flex flex-col sm:flex-row gap-4 mt-8">
                      <p>
                        New here?{" "}
                        <Link href="/signup" className="underline">
                          Create Account
                        </Link>
                      </p>
                      <p>
                        <Link href="/forgotpass" className="underline">
                          Forgot Password?
                        </Link>
                      </p>
                    </div>
                  </CardFooter>
                </Form>
              </Formik>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="footer">
        <Footer />
      </div>
    </div>
  );
}
