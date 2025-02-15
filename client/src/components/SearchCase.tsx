"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Download, Search, SquareArrowOutUpRight } from "lucide-react";
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

interface CaseLaw {
  url: string;
  // file_location?: string;
  metadata: {
    "Case Number:": string;
    "Parties:": string;
    "Date Delivered:": string;
    "Court:": string;
    "Case Action:": string;
    "Judge(s):": string;
    "Citation:": string;
    "Advocates:"?: string;
    "Court Division:"?: string;
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
  const casesPerPage = 10;

  // Fetch case laws from JSON file
  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await fetch("/data/case_laws.json");

        if (!response.ok) {
          throw new Error(`HTTP error. Status: ${response.status}`);
        }

        const data: CaseLaw[] = await response.json();
        console.log("fetched data: ", data);
        setCases(data);
        setFilteredCases(data);
      } catch (error) {
        console.error("Error fetching cases: ", error);
      }
    };
    fetchCases();
  }, []);

  // Filtering logic
  useEffect(() => {
    let results = cases.filter((c) =>
      c.metadata["Parties:"].toLowerCase().includes(query.toLowerCase())
    );
    if (judge)
      results = results.filter((c) => c.metadata["Judge(s):"] === judge);
    if (court) results = results.filter((c) => c.metadata["Court:"] === court);
    if (topic)
      results = results.filter((c) => c.metadata["Court Division:"] === topic);
    setFilteredCases(results);
    setCurrentPage(1); // Reset pagination when filters change
  }, [query, judge, court, cases]);

  // Pagination logic
  const indexOfLastCase = currentPage * casesPerPage;
  const indexOfFirstCase = indexOfLastCase - casesPerPage;
  const currentCases = filteredCases.slice(indexOfFirstCase, indexOfLastCase);
  const totalPages = Math.ceil(filteredCases.length / casesPerPage);

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

              {Array.from(new Set(cases.map((c) => c.metadata["Judge(s):"])))
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
                new Set(cases.map((c) => c.metadata["Court Division:"]))
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
              {Array.from(new Set(cases.map((c) => c.metadata["Court:"])))
                .filter((c) => c)
                .map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>

        {currentCases.length > 0 ? (
          <div className="grid gap-4">
            {currentCases.map((caseLaw, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-xl">Case Law Title</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-1 text-base">
                    <p>
                      <strong>Court:</strong> {caseLaw.metadata["Court:"]}
                    </p>
                    <p>
                      <strong>Case Number:</strong>{" "}
                      {caseLaw.metadata["Case Number:"]}
                    </p>
                    <p>
                      <strong>Judge:</strong> {caseLaw.metadata["Judge(s):"]}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Link href={caseLaw.url} target="_blank">
                      <Button variant="main">
                        <Download />
                        Download PDF</Button>
                    </Link>

                    <Link href={caseLaw.url} target="_blank">
                      <Button variant="purple">
                        <SquareArrowOutUpRight />
                        View in KLR</Button>
                    </Link>

                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No case laws found.</p>
        )}

        {totalPages > 1 && (
          <Pagination className="mt-6 cursor-pointer">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                />
              </PaginationItem>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 ${
                        currentPage === page ? "bg-accent-foreground text-[#fff] hover:bg-accent-foreground hover:text-[#fff]" : ""
                      }`}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
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
