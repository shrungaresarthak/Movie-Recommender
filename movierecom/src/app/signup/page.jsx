"use client";
import React, { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Lancelot } from "next/font/google";
import { signIn, useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import Footer from "../helpers/Footer";
import Link from "next/link";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Modal } from "../helpers/Modal";
import { ClipLoader } from "react-spinners";
import { FaRegEyeSlash } from "react-icons/fa";
import { EyeOpenIcon } from "@radix-ui/react-icons";



const lancelot = Lancelot({ subsets: ["latin"], weight: ["400"] });

const SignupSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function Page() {
  const router = useRouter();
  const { data: session } = useSession();
  const [error,setError] = useState();
  const [isDialogOpen,setIsDialogOpen] = useState(false)
  if (session) {
    redirect("/user/recom");
  }

  const [pass,showPass] = useState(false)
    const className= "flex h-9 w-full rounded-md   bg-zinc-800/80 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"

  const handleSignIn = async (values) => {

    try {
      await axios.post("http://localhost:5000/signup", {
        name: values.name,
        email: values.email,
        password: values.password,
      })
      
      router.push("/login");
    } catch (error) {
      console.error(error.response.data.message);
      setError(error.response.data.message)
      setIsDialogOpen(true)
    }
    
  };

  return (
    <>
        <Navbar />
      <div className="relative">
        <img
          src="https://repository-images.githubusercontent.com/275336521/20d38e00-6634-11eb-9d1f-6a5232d0f84f"
          className="h-screen  w-full object-cover brightness-50"
          alt="MovieDB Hero"
        />
      </div>
      <Modal isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} errormsg={error}/>

      <div className="absolute top-10 w-full  justify-center">
        <div className="crd pt-24 flex flex-col items-center px-4 sm:px-8 lg:px-0">
          <Card className="w-full max-w-lg bg-black/40 p-5">
            <CardHeader>
              <CardTitle
                className={` ${lancelot.className} text-red-500 text-center text-4xl sm:text-5xl md:text-6xl`}
              >
                MovieDB
              </CardTitle>
            </CardHeader>

            <CardContent>
              <Formik
                initialValues={{ name: "", email: "", password: "" }}
                validationSchema={SignupSchema}
                onSubmit={(values) => {
                  handleSignIn(values);
                  
                }}
              >
                  <Form>
                    <div className="grid w-full items-center mt-10 text-white gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="name">Name</Label>
                        <Field
                          id="name"
                          name="name"
                          type="text"
                          className={className}
                        />
                        <ErrorMessage
                          name="name"
                          component="span"
                          className="text-red-500"
                        />
                      </div>

                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="email">Email</Label>
                        <Field
                          id="email"
                          name="email"
                          type="email"
                          className={className}
                        />
                        <ErrorMessage
                          name="email"
                          component="span"
                          className="text-red-500"
                        />
                      </div>

                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="pass">Password</Label>
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
                          component="span"
                          className="text-red-500"
                        />
                      </div>
                    </div>

                    <CardFooter className="flex flex-col w-full mt-10 text-white items-center">
                      <Button
                        variant="destructive"
                        type="submit"
                        className={`w-full`}
                      >
                        Submit
                      </Button>
                      <div className="links self-start mt-8">
                        <p>
                          Already have an account?{" "}
                          <Link href="/login" className="underline">
                            Login
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

      <div className="sm:mt-16 md:mt-16 lg:mt-0">
        <Footer />
      </div>
    </>
  );
}
