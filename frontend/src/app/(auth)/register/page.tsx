import { Metadata } from "next";
import Link from "next/link";

import { Button } from "@nextui-org/react";
import { FiChevronLeft } from "react-icons/fi";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
  title: "Register",
  description: "Create an account",
};

const RegisterPage = () => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <Link href="/" className="absolute left-4 top-4 md:left-8 md:top-8">
        <Button variant="bordered" className="text-white">
          <div className="flex items-center">
            <FiChevronLeft className="mr-2 h-4 w-4" />
            Go home
          </div>
        </Button>
      </Link>

      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
