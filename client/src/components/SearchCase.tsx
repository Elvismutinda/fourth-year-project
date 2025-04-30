"use client";

import { useEffect, useState, useTransition } from "react";
import { debounce } from "lodash";
import { motion } from "framer-motion";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import Link from "next/link";

import { Skeleton } from "./ui/skeleton";
import { getAllCaseLaws, searchCaseLaws } from "@/app/app/caselaws/actions";

interface CaseLaw {
  id: string;
  url: string;
  // file_location?: string;
  metadata: {
    case_number: string;
    date_published: string;
    court: string;
    case_action: string;
    judges: string;
    citation: string;
    advocates?: string;
    court_division?: string;
  };
}

const SearchCase = () => {
  const [query, setQuery] = useState("");
  const [judge, setJudge] = useState("");
  const [topic, setTopic] = useState("");
  const [court, setCourt] = useState("");
  const [cases, setCases] = useState<CaseLaw[]>([]);
  const [isPending, startTransition] = useTransition();
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const casesPerPage = 10;

  useEffect(() => {
    async function loadCases() {
      try {
        const allCases = await getAllCaseLaws();
        setCases(
          allCases.map((caseLaw) => ({
            ...caseLaw,
            url: caseLaw.url || "",
            metadata: caseLaw.metadata as CaseLaw["metadata"],
          }))
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadCases();
  }, []);

  const fetchCases = () => {
    startTransition(async () => {
      try {
        const response = await searchCaseLaws({
          query,
          judge,
          court,
          topic,
        });
        setCases(
          response.map((caseLaw) => ({
            ...caseLaw,
            url: caseLaw.url || "",
            metadata: caseLaw.metadata as CaseLaw["metadata"],
          }))
        );
        setCurrentPage(1);
      } catch (error) {
        console.error("Error fetching cases:", error);
      }
    });
  };

  const debouncedFetchCases = debounce(() => {
    fetchCases();
  }, 500);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    debouncedFetchCases();
  };

  const handleFilterChange = (filterType: string, value: string) => {
    if (filterType === "judge") setJudge(value);
    if (filterType === "topic") setTopic(value);
    if (filterType === "court") setCourt(value);

    fetchCases();
  };

  // Pagination logic
  const indexOfLastCase = currentPage * casesPerPage;
  const indexOfFirstCase = indexOfLastCase - casesPerPage;
  const currentCases = cases.slice(indexOfFirstCase, indexOfLastCase);
  const totalPages = Math.ceil(cases.length / casesPerPage);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mx-auto flex h-full max-w-3xl flex-col gap-6 px-5 pt-6 sm:gap-8 xl:max-w-4xl xl:pt-10"
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto flex-grow px-4 py-8"
      >
        {/* <h1 className="text-2xl font-bold mb-4">Search Case Laws</h1> */}

        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Search case laws..."
            value={query}
            onChange={handleQueryChange}
            className="h-11 flex-grow text-slate-300 placeholder:text-slate-300"
          />
          {/* <Button onClick={handleSearch}
            disabled={isPending} variant="purple" className="h-11">
            <Search size={18} />
          </Button> */}
        </div>

        <div className="mb-8 grid grid-cols-1 gap-3 lg:grid-cols-3 text-slate-300">
          <Select onValueChange={(value) => handleFilterChange("judge", value)}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Search judges..." />
            </SelectTrigger>
            <SelectContent>
              {Array.from(new Set(cases.map((c) => c.metadata["judges"])))
                .filter((j) => j) // Remove empty values
                .map((j) => (
                  <SelectItem key={j} value={j}>
                    {j}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => handleFilterChange("topic", value)}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Search topics..." />
            </SelectTrigger>
            <SelectContent>
              {Array.from(
                new Set(cases.map((c) => c.metadata["court_division"]))
              )
                .filter((c): c is string => !!c)
                .map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => handleFilterChange("court", value)}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Search courts..." />
            </SelectTrigger>
            <SelectContent>
              {Array.from(new Set(cases.map((c) => c.metadata["court"])))
                .filter((c) => c)
                .map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {isPending ? (
          <div className="grid gap-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="h-52 rounded-xl border bg-transparent/50 border-gray-800"
              >
                <Skeleton className="h-6 w-3/4 my-8 mx-6 bg-slate-300" />
                <div className="space-y-4 my-8 mx-6">
                  <Skeleton className="h-4 w-1/2 bg-slate-300" />
                  <Skeleton className="h-4 w-2/3 bg-slate-300" />
                  <Skeleton className="h-4 w-1/3 bg-slate-300" />
                </div>
              </div>
            ))}
          </div>
        ) : currentCases.length > 0 ? (
          <div className="grid gap-4">
            {currentCases.map((caseLaw) => (
              <Link
                key={caseLaw.id}
                href={`/app/caselaws/${caseLaw.id}`}
                className="block"
              >
                <Card className="bg-transparent/50 text-slate-300 border-gray-800 cursor-pointer transition-transform hover:scale-[1.02]">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">
                      {caseLaw.metadata.citation.replace(/\s*copy\s*$/i, "")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 py-2">
                      <p>
                        <strong>Court:</strong> {caseLaw.metadata["court"]}
                      </p>
                      <p>
                        <strong>Case Number:</strong>{" "}
                        {caseLaw.metadata["case_number"]}
                      </p>
                      <p>
                        <strong>Judges:</strong> {caseLaw.metadata["judges"]}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <p className="flex items-center justify-center text-slate-300">No case laws found.</p>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="mt-6 text-slate-300">
            <PaginationContent className="flex justify-center items-center gap-4">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  className={
                    currentPage === 1
                      ? "pointer-events-none opacity-50"
                      : "hover:bg-transparent/30 hover:text-white-100 border-none"
                  }
                />
              </PaginationItem>

              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages)
                      setCurrentPage(currentPage + 1);
                  }}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "hover:bg-transparent/30 hover:text-white-100 border-none"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </motion.div>
    </motion.div>
  );
};

export default SearchCase;
