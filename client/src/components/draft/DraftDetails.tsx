"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { documents } from "@/config/documents";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Link from "next/link";
import { Button } from "../ui/button";
import { PencilLine, Plus } from "lucide-react";

const ITEMS_PER_PAGE = 10;

const DraftDetails = () => {
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const selectedCategory = documents[selectedCategoryIndex];
  const totalItems = selectedCategory.documents.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const paginatedDocuments = selectedCategory.documents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCategoryChange = (index: number) => {
    setSelectedCategoryIndex(index);
    setCurrentPage(1); // reset pagination on category switch
  };
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mx-auto flex h-full flex-col gap-6 px-5 sm:gap-8"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto flex-grow px-4"
      >
        <div className="mb-4 flex flex-col md:flex-row justify-between ">
          <h1 className="text-2xl font-bold mb-4">Draft Legal Documents</h1>
          <Link href="/app/draft/custom">
            <Button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-neutral bg-back shadow-sm hover:bg-neutral/60 h-9 px-4 py-2">
              <Plus className="mr-2 h-4 w-4" />
              Need Something specific? Use the AI Assistant instead.
            </Button>
          </Link>
        </div>

        {/* Category Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {documents.map((docCategory, index) => (
            <button
              key={index}
              onClick={() => handleCategoryChange(index)}
              className={`mx-0.5 inline-flex items-center justify-center whitespace-nowrap rounded-md px-2.5 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow text-accent ${
                index === selectedCategoryIndex
                  ? "bg-black"
                  : "hover:bg-black/50"
              }`}
            >
              {docCategory.category}
            </button>
          ))}
        </div>

        {/* Document Types */}
        <div className="flex flex-col divide-y divide-gray-200 border-b">
          {paginatedDocuments.map((doc, index) => (
            <div key={index} className="py-4">
              <Link href={`/app/draft/${doc.slug}`}>
                <h2 className="text-lg font-medium underline">{doc.name}</h2>
              </Link>
              <p className="text-sm text-slate-300 line-clamp-2">
                {doc.description?.summary}
              </p>

              <Link href={`/app/draft/${doc.slug}`}>
                <Button className="mt-8 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-neutral bg-back shadow-sm hover:bg-neutral/60 h-9 px-4 py-2">
                  <PencilLine />
                  Create
                </Button>
              </Link>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
                <PaginationItem className="text-sm px-4 py-2">
                  Page {currentPage} of {totalPages}
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default DraftDetails;
