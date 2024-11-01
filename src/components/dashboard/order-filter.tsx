"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Filter } from "lucide-react";

export function OrderFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [minOrderDate, setMinOrderDate] = useState(
    searchParams.get("minOrderDate") || ""
  );
  const [maxOrderDate, setMaxOrderDate] = useState(
    searchParams.get("maxOrderDate") || ""
  );
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setQuery(searchParams.get("query") || "");
    setMinOrderDate(searchParams.get("minOrderDate") || "");
    setMaxOrderDate(searchParams.get("maxOrderDate") || "");
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (minOrderDate) params.set("minOrderDate", minOrderDate);
    if (maxOrderDate) params.set("maxOrderDate", maxOrderDate);
    router.push(`?${params.toString()}`);
    setOpen(false);
  };

  const handleReset = () => {
    setQuery("");
    setMinOrderDate("");
    setMaxOrderDate("");
    router.push("");
    setOpen(false);
  };

  const isFiltered = query || minOrderDate || maxOrderDate;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="mb-4">
          <Filter className="mr-2 h-4 w-4" />
          {isFiltered ? "Filters Applied" : "Filter"}
          {isFiltered && (
            <span className="ml-2 rounded-full bg-primary w-2 h-2" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="query">Search</Label>
            <Input
              id="query"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search orders..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="minOrderDate">Min Order Date</Label>
            <Input
              id="minOrderDate"
              type="date"
              value={minOrderDate}
              onChange={(e) => setMinOrderDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxOrderDate">Max Order Date</Label>
            <Input
              id="maxOrderDate"
              type="date"
              value={maxOrderDate}
              onChange={(e) => setMaxOrderDate(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              Apply Filters
            </Button>
            <Button type="button" variant="outline" onClick={handleReset}>
              Reset
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
