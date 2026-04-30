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

const FilterSideBar = ({
  allProducts,
  search,
  setSearch,
  brand,
  setBrand,
  category,
  setCategory,
  sortOrder,
  setSortOrder,
}) => {
  // ===== UNIQUE VALUES =====
  const uniqueCategory = useMemo(() => {
    const cats = allProducts.map((p) => p.category);
    return ["All", ...new Set(cats)];
  }, [allProducts]);

  const uniqueBrand = useMemo(() => {
    const brands = allProducts.map((p) => p.brand);
    return ["All", ...new Set(brands)];
  }, [allProducts]);

  const resetFilters = () => {
    setSearch("");
    setBrand("All");
    setCategory("All");
    setSortOrder("");
  };

  return (
    <div className="hidden md:block w-72 sticky top-24">
      <Card className="shadow-md rounded-2xl">
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* 🔍 SEARCH */}
          <div>
            <label className="text-sm font-medium mb-2 block">Search</label>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
            />
          </div>

          {/* 📂 CATEGORY */}
          <div>
            <label className="text-sm font-medium mb-2 block">Category</label>

            <div className="flex flex-wrap gap-2">
              {uniqueCategory.map((item) => (
                <button
                  key={item}
                  onClick={() => setCategory(item)}
                  className={`px-3 py-1 text-sm rounded-full border ${
                    category === item
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* 🏷️ BRAND */}
          <div>
            <label className="text-sm font-medium mb-2 block">Brand</label>

            <Select value={brand} onValueChange={setBrand}>
              <SelectTrigger>
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  {uniqueBrand.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          {/* 🔄 RESET */}
          <Button variant="outline" className="w-full" onClick={resetFilters}>
            Reset Filters
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FilterSideBar;
