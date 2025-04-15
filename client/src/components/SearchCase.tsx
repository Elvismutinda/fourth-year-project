"use client";

import { useEffect, useState } from "react";
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
import { getCaseLaws } from "@/app/app/caselaws/actions";
import { Skeleton } from "./ui/skeleton";

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
  const [filteredCases, setFilteredCases] = useState<CaseLaw[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const casesPerPage = 10;

  useEffect(() => {
    const fetchCases = async () => {
      try {
        setLoading(true);
        const response = await getCaseLaws({
          query,
          judge,
          court,
          topic,
        });
        setCases(response);
        setFilteredCases(response);
      } catch (error) {
        console.error("Error fetching cases:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, [query, judge, court, topic]);

  // Filtering logic
  useEffect(() => {
    let results = cases.filter((c) =>
      c.metadata?.case_number?.toLowerCase().includes(query.toLowerCase())
    );

    if (judge) results = results.filter((c) => c.metadata?.judges === judge);
    if (court) results = results.filter((c) => c.metadata?.court === court);
    if (topic)
      results = results.filter((c) => c.metadata?.court_division === topic);

    setFilteredCases(results);
    setCurrentPage(1); // Reset pagination when filters change
  }, [query, judge, court, topic, cases]);

  // Pagination logic
  const indexOfLastCase = currentPage * casesPerPage;
  const indexOfFirstCase = indexOfLastCase - casesPerPage;
  const currentCases = filteredCases.slice(indexOfFirstCase, indexOfLastCase);
  const totalPages = Math.ceil(filteredCases.length / casesPerPage);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

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
            onChange={(e) => setQuery(e.target.value)}
            className="h-11 flex-grow"
          />
          <Button variant="purple" className="h-11">
            <Search size={18} />
          </Button>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-3 lg:grid-cols-3">
          <Select onValueChange={setJudge}>
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

          <Select onValueChange={setTopic}>
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

          <Select onValueChange={setCourt}>
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

        {loading ? (
          <div className="grid gap-4">
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="h-52 rounded-xl border bg-card text-card-foreground"
              >
                <Skeleton className="h-6 w-3/4 my-8 mx-6" />
                <div className="space-y-4 my-8 mx-6">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : currentCases.length > 0 ? (
          <div className="grid gap-4">
            {currentCases.map((caseLaw, index) => (
              <Link
                key={index}
                href={`/app/caselaws/${caseLaw.id}`}
                className="block"
              >
                <Card className="cursor-pointer transition-transform hover:scale-[1.02]">
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
          <p className="text-gray-500">No case laws found.</p>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="mt-6">
            <PaginationContent className="flex justify-center items-center gap-4">
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
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
                      : ""
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
