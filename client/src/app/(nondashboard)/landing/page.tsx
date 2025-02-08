"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { useCarousel } from "@/hooks/use-carousel";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { topics } from "@/config/topics";
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
  const [selectedTopic, setSelectedTopic] = useState<{
    id: number;
    title: string;
    image: string;
    description: string;
  } | null>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleOpen = (topic: {
    id: number;
    title: string;
    image: string;
    description: string;
  }) => {
    setSelectedTopic(topic);
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
            Access comprehensive case laws instantly, ensuring accuracy and efficiency in your legal practice.
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
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        viewport={{ amount: 0.3, once: true }}
        className="mx-auto py-12 mt-10"
      >
        <h2 className="text-2xl text-[#2c3854] font-bold mb-4">
          Featured Practice Areas
        </h2>
        <p className="text-[#2c3854] mb-8">
        Specialized Legal Assistance Across Key Practice Areas.
        </p>

        <div className="flex flex-wrap gap-4 mb-8">
          {[
            // "Employment and Labor Law",
            // "Litigation and Dispute Resolution",
            "Family Law",
            "Corporate and Business Law",
            "Criminal Law",
            "Intellectual Property Law",
            "Real Estate Law",
            // "Estate Planning and Probate Law",
            "Tax Law",
          ].map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-customgreys-secondarybg rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {topics.map((topic) => (
            <Card
              key={topic.id}
              onClick={() => handleOpen(topic)}
              className="cursor-pointer"
            >
              <CardHeader className="text-[#2c3854] ">
                <CardTitle>{topic.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Image
                  src={topic.image}
                  alt={topic.title}
                  width={300}
                  height={200}
                  className="rounded-md"
                />
                <p className="text-sm text-[#2c3854] mt-2 line-clamp-3">
                  {topic.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="text-[#2c3854] ">
            <DialogHeader>
              <DialogTitle>{selectedTopic?.title}</DialogTitle>
            </DialogHeader>
            <Image
              src={selectedTopic?.image || "/hero1.jpg"}
              alt={selectedTopic?.title || "Practice Area"}
              width={600}
              height={400}
              className="rounded-md"
            />
            <p className="mt-4">{selectedTopic?.description}</p>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className="text-[#2c3854] items-center justify-center">
            <DrawerHeader>
              <DrawerTitle>{selectedTopic?.title}</DrawerTitle>
            </DrawerHeader>
            <Image
              src={selectedTopic?.image || "/hero1.jpg"}
              alt={selectedTopic?.title || "Practice Area"}
              width={400}
              height={300}
              className="rounded-md"
            />
            <p className="mt-4 p-4">{selectedTopic?.description}</p>
          </DrawerContent>
        </Drawer>
      )}
    </motion.div>
  );
};

export default LandingPage;
