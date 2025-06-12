import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  InstagramLogoIcon,
  LinkedInLogoIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";
import { Lancelot, Poppins } from "next/font/google";
import Link from "next/link";
import React from "react";
import { FaCopyright, FaFacebook } from "react-icons/fa";

const lancelot = Lancelot({ weight: ["400"], subsets: ["latin"] });
const poppins = Poppins({ weight: ["400"], subsets: ["latin"] });

export default function Footer() {
  const servicelist = ["Terms of Service", "Security", "Privacy Policy", "Career"];

  return (
    <div className="bg-zinc-800 text-white py-10">
      <div className="ml-20">
        <p className={`text-red-600 ${lancelot.className} text-5xl sm:text-6xl lg:text-7xl`}>
          MovieDB
        </p>
      </div>

      <div className="middle flex flex-col sm:flex-row justify-between mt-10 sm:mt-20 px-6 sm:px-10 lg:px-20">
        <div className="middleleft mb-10 sm:mb-0">
          {servicelist.map((serv, index) => (
            <p
              key={index}
              className={`cursor-pointer ${poppins.className} text-lg sm:text-xl mt-4 sm:mt-8`}
            >
              {serv}
            </p>
          ))}
        </div>

        <div className="middlecenter text-center mb-10 sm:mb-0">
          <p className={`text-xl sm:text-2xl ${poppins.className}`}>Follow us on</p>
          <div className="flex justify-center mt-4 sm:mt-5 space-x-4 sm:space-x-6">
            <Link href={'https://www.instagram.com/scott.fernandes_19/'} target="blank" ><InstagramLogoIcon className="cursor-pointer w-6 h-6" /></Link>
            <FaFacebook className="cursor-pointer w-6 h-6" />
            <TwitterLogoIcon className="cursor-pointer w-6 h-6" />
            <Link href={'https://www.linkedin.com/in/scott-fernandes-5aa218246/'} target="blank"><LinkedInLogoIcon className="cursor-pointer w-6 h-6" /></Link>
          </div>
        </div>

        <div className="middleright">
          <form>
            <div className="name mb-4">
              <Label>Name:</Label>
              <Input className="w-full sm:w-[250px] lg:w-[300px] border" />
            </div>
            <div className="email mb-4">
              <Label>Email:</Label>
              <Input className="w-full sm:w-[250px] lg:w-[300px] border" />
            </div>
            <div className="message mb-4">
              <Label>Message:</Label>
              <Textarea className="w-full sm:w-[250px] lg:w-[300px] bg-transparent border" />
            </div>
            <Button type="submit" className="w-full" variant="destructive">
              Submit
            </Button>
          </form>
        </div>
      </div>

      <div className="text-center mt-10">
        <p className="text-sm sm:text-lg">
          <FaCopyright className="inline-block mr-1" />
          All Copyrights Reserved, 2024
        </p>
      </div>
    </div>
  );
}
