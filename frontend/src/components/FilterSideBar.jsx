import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const format = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const FilterSideBar = ({
  allProducts,
  search,
  setSearch,
  brand,
  setBrand,
  category,
  setCategory,
  setSortOrder,
}) => {
  const uniqueCategory = useMemo(() => {
    return [
      "all",
      ...Array.from(
        new Set(
          allProducts
            .map((p) => p.category?.trim().toLowerCase())
            .filter(Boolean),
        ),
      ).sort((a, b) => a.localeCompare(b)),
    ];
  }, [allProducts]);

  const uniqueBrand = useMemo(() => {
    return [
      "all",
      ...Array.from(
        new Set(
          allProducts.map((p) => p.brand?.trim().toLowerCase()).filter(Boolean),
        ),
      ).sort((a, b) => a.localeCompare(b)),
    ];
  }, [allProducts]);

  const resetFilters = () => {
    setSearch("");
    setBrand("all");
    setCategory("all");
    setSortOrder("categoryAZ");
  };

  return (
    <div className="hidden md:block w-65 sticky top-30">
      <Card className="shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* SEARCH */}
          <div>
            <label className="text-sm font-medium mb-2 block">Search</label>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="text-sm font-medium mb-2 block">Category</label>
            <div className="flex flex-wrap gap-2">
              {uniqueCategory.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`px-3 py-1 text-sm rounded-full border transition ${
                    category === item
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {format(item)}
                </button>
              ))}
            </div>
          </div>

          {/* BRAND */}
          <div>
            <label className="text-sm font-medium mb-2  block">Brand</label>

            <Select value={brand} onValueChange={setBrand}>
              <SelectTrigger>
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  {uniqueBrand.map((item) => (
                    <SelectItem key={item} value={item}>
                      {format(item)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* RESET */}
          <Button variant="outline" className="w-full" onClick={resetFilters}>
            Reset Filters
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FilterSideBar;
