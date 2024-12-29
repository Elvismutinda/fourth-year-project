import Image from "next/image";
import React from "react";
import logoImage from "../../public/images/logosaas.png";
import { MdMenu } from "react-icons/md";
import { links } from "@/config/data";
import Link from "next/link";
import { Button } from "@nextui-org/react";

export const MainNav = () => {
  return (
    <div className="bg-black">
      <div className="px-4">
        <div className="py-4 flex items-center justify-between">
          <div className="relative">
            <div className="absolute w-full top-2 bottom-0 bg-[linear-gradient(to_right,#F87BFF,#FB92CF,#FFDD9B,#C2F0B1,#2FD8FE)] blur-md"></div>
            <Image src={logoImage} alt="logo" className="h-12 w-12 relative" />
          </div>
          <div className="border border-white border-opacity-30 h-10 w-10 inline-flex justify-center items-center rounded-lg sm:hidden">
            <MdMenu className="w-8 h-8" color="white" />
          </div>
          <nav className="hidden gap-6 items-center sm:flex">
            {links.map((link) => (
              <Link
                href={link.hash}
                className="text-opacity-60 text-white hover:text-opacity-100 transition"
                key={link.hash}
              >
                {link.name}
              </Link>
            ))}
            <Link href="/login">
            <Button size="lg">Login</Button>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};
