import Product from "@/pages/product/Product";
import React, { useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";

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
  const categories = allProducts.map((prod) => prod.category);
  const uniqueCategory = ["All", ...new Set(categories)];
  const brands = allProducts.map((prod) => prod.brand);
  const uniqueBrand = ["All", ...new Set(brands)];

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleCategory = (value) => {
    setCategory(value);
  };

  const resetFilters = () => {
    setSearch("");
    setBrand("All");
    setCategory("All");
    setSortOrder("");
  };

  return (
    <div className="bg-gray-100 mt-15 p-4 rounded-md h-max hidden md:block w-64">
      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={handleSearch}
        placeholder="Search..."
        className="bg-white p-2 rounded-md border-gray-400 border-2 w-full"
      />
      {/* category */}

      <h1 className="mt-5 font-semibold text-xl"> Category </h1>
      <div className="flex flex-col gap-2 mt-3">
        {uniqueCategory.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="radio"
              checked={category === item}
              onChange={() => handleCategory(item)}
            ></input>
            <label>{item}</label>
          </div>
        ))}
      </div>

      {/* brands */}
      <h1 className="mt-5 font-semibold text-xl"> Brands </h1>

      <Select
        value={uniqueBrand[0]}
        onValueChange={setBrand}
        className="bg-white w-full p-2 border-gray-200 border-2 rounded-lg"
      >
        <SelectTrigger className="w-full max-w-60">
          <SelectValue placeholder="Brands..." />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            {uniqueBrand.map((item, index) => (
              <SelectItem key={index} value={item}>
                {item.toUpperCase()}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      {/* reset filters */}
      <Button
        onClick={resetFilters}
        className="bg-blue-600 w-full text-white mt-5 cursor-pointer mt-20"
      >
        Reset Filters
      </Button>
    </div>
  );
};

export default FilterSideBar;
