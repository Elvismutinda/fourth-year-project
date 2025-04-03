"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { useCarousel } from "@/hooks/use-carousel";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { useCases } from "@/config/topics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

const LoadingSkeleton = () => {
  return (
    <div className="w-3/4">
      <div className="flex justify-between items-center mt-12 h-[500px] rounded-lg">
        <div className="basis-1/2 px-16 mx-auto">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-4 w-96 mb-2" />
          <Skeleton className="h-4 w-72 mb-8" />
          <Skeleton className="w-40 h-10" />
        </div>
        <Skeleton className="basis-1/2 h-full rounded-r-lg" />
      </div>

      <div className="mx-auto py-12 mt-10">
        <Skeleton className="h-6 w-48 mb-4" />
        <Skeleton className="h-4 w-full max-w-2xl mb-8" />

        <div className="flex flex-wrap gap-4 mb-8">
          {[1, 2, 3, 4, 5].map((_, index) => (
            <Skeleton key={index} className="w-24 h-6 rounded-full" />
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((_, index) => (
            <Skeleton key={index} className="h-[300px] rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
};

const LandingPage = () => {
  const currentImage = useCarousel({ totalImages: 3 });
  const [open, setOpen] = useState(false);
  // const [selectedTopic, setSelectedTopic] = useState<{
  //   id: number;
  //   title: string;
  //   image: string;
  //   description: string;
  // } | null>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleOpen = (topic: {
    // id: number;
    title: string;
    image: string;
    description: string;
  }) => {
    // setSelectedTopic(topic);
    setOpen(true);
  };

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) return <LoadingSkeleton />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-3/4"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mt-12 h-[500px] rounded-lg bg-[#130c49]"
      >
        <div className="basis-1/2 px-16 mx-auto">
          <h1 className="text-4xl font-bold mb-4">
            Intelligent research and case retrieval tool
          </h1>
          <p className="text-base text-gray-400 mb-8">
            Access comprehensive case laws instantly, ensuring accuracy and
            efficiency in your legal practice.
            <br />
            Research has never been easier.
          </p>
          <div className="w-fit">
            <Link href="/login" scroll={false}>
              <Button
                variant="main"
                className="px-4 py-2 rounded-md font-semibold"
              >
                Get started
              </Button>
            </Link>
          </div>
        </div>
        <div className="basis-1/2 h-full relative overflow-hidden rounded-r-lg">
          {["/hero1.jpg", "/hero2.jpg", "/hero3.jpg"].map((src, index) => (
            <Image
              key={src}
              src={src}
              alt={`Hero Banner ${index + 1}`}
              fill
              priority={index === currentImage}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={`object-cover transition-opacity duration-500 opacity-0 ${
                index === currentImage ? "opacity-100" : ""
              }`}
            />
          ))}
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mx-auto py-12"
      >
        <h2 className="text-center text-lg font-semibold text-gray-500 uppercase">
          The Intelaw Advantage, Time to Over Deliver.
        </h2>
        <h1 className="text-center text-4xl font-bold text-gray-900 mt-2">
          Elevate your legal research with{" "}
          <span className="text-blue-600">unparalleled</span> clarity
        </h1>

        <div className="flex flex-col md:flex-row justify-between items-center mt-12 gap-8">
          {/* Left use cases */}
          <div className="flex flex-col md:w-1/3 space-y-8">
            {useCases.slice(0, 2).map((useCase) => (
              <div key={useCase.id} className="text-center">
                <h3 className="text-4xl font-semibold text-blue-600">
                  {useCase.id}
                </h3>
                <h4 className="text-lg font-bold text-gray-900">
                  {useCase.title}
                </h4>
                <p className="text-gray-600 mt-2">{useCase.description}</p>
              </div>
            ))}
          </div>

          <Card
            onClick={() =>
              handleOpen({
                title: "Criminal Law",
                description:
                  "Criminal law defines offenses against the state and prescribes punishments for those who violate them. It includes laws related to theft, assault, fraud, and other crimes, as well as legal procedures to ensure due process and justice for both the accused and victims.",
                image: "/assets/images/criminal_law.jpg",
              })
            }
            className="w-full md:w-1/3 p-6 shadow-lg text-center cursor-pointer"
          >
            <CardHeader>
              <CardTitle>Criminal Law</CardTitle>
            </CardHeader>
            <CardContent>
              <Image
                src="/assets/images/criminal_law.jpg"
                alt="Criminal Law"
                width={300}
                height={200}
                className="rounded-md"
              />
              <p className="text-sm text-[#2c3854] mt-2 line-clamp-3">
                Criminal law defines offenses against the state and prescribes
                punishments for those who violate them. It includes laws related
                to theft, assault, fraud, and other crimes, as well as legal
                procedures to ensure due process and justice for both the
                accused and victims.
              </p>
            </CardContent>
          </Card>

          {/* Right use cases */}
          <div className="flex flex-col md:w-1/3 space-y-8">
            {useCases.slice(2, 4).map((useCase) => (
              <div key={useCase.id} className="text-center">
                <h3 className="text-4xl font-semibold text-blue-600">
                  {useCase.id}
                </h3>
                <h4 className="text-lg font-bold text-gray-900">
                  {useCase.title}
                </h4>
                <p className="text-gray-600 mt-2">{useCase.description}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="text-[#2c3854] ">
            <DialogHeader>
              <DialogTitle>Criminal Law</DialogTitle>
            </DialogHeader>
            <Image
              src={"/assets/images/criminal_law.jpg"}
              alt={"Criminal Law"}
              width={600}
              height={400}
              className="rounded-md"
            />
            <p className="mt-4">
              Criminal law defines offenses against the state and prescribes
              punishments for those who violate them. It includes laws related
              to theft, assault, fraud, and other crimes, as well as legal
              procedures to ensure due process and justice for both the accused
              and victims.
            </p>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className="text-[#2c3854] items-center justify-center">
            <DrawerHeader>
              <DrawerTitle>Criminal Law</DrawerTitle>
            </DrawerHeader>
            <Image
              src={"/assets/images/criminal_law.jpg"}
              alt={"Criminal Law"}
              width={400}
              height={300}
              className="rounded-md"
            />
            <p className="mt-4 p-4">
              Criminal law defines offenses against the state and prescribes
              punishments for those who violate them. It includes laws related
              to theft, assault, fraud, and other crimes, as well as legal
              procedures to ensure due process and justice for both the accused
              and victims.
            </p>
          </DrawerContent>
        </Drawer>
      )}
    </motion.div>
  );
};

export default LandingPage;
