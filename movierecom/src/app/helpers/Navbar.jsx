"use client";
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { Lancelot, Poppins } from "next/font/google";
const lancelot = Lancelot({ subsets: ["latin"], weight: ["400"] });
const poppins = Poppins({ subsets: ["latin"], weight: ["600", "300"] });
import { BiMenu } from "react-icons/bi";
import { signIn, signOut, useSession } from "next-auth/react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

function NavContent() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        <>
       <div className="topSide flex items-center">
        <Link href={"/user"}>
        <p className="name text-red-500 text-lg text-ellipsis">{session.user.email}</p>        

        </Link>
       </div>
       <Link href={"/user/recom"} className="mt-10">
        <li className=" cursor-pointer">Search Movies</li>
      </Link>
      <Link href={"/user/watchlist"}>
        <li className="cursor-pointer">View Watchlist</li>
      </Link>
      <li className="cursor-pointer" onClick={()=>(signOut({callbackUrl:'/login'}))}>
        Sign Out
      </li>
              
        </>
      </>
    );
  }

  return (
    <>
      <Link href={"/"}>
        <li className=" cursor-pointer">Home</li>
      </Link>
     
      <li className="cursor-pointer" onClick={signIn}>
        Sign In
      </li>
    </>
  );
}
const Navbar = () => {
return (
  <Sheet  className=''>
  <SheetTrigger className="">
    <BiMenu className="w-12 h-12 m-5 text-white cursor-pointer"/>
  </SheetTrigger>
  <SheetContent side='left' className= ' bg-zinc-900'>
    <SheetHeader>
      <SheetTitle className={`${lancelot.className} text-white text-5xl`}>MovieDB</SheetTitle>
      <SheetDescription className={` ${poppins.className} text-2xl text-white pt-5 flex flex-col gap-9`}>
    
       <NavContent/>
      </SheetDescription>
    </SheetHeader>
    <SheetClose className="text-white"/>
  </SheetContent>
</Sheet>
  );
};

export default Navbar;
