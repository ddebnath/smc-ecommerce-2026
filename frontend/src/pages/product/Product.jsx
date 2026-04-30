import React, { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import FilterSideBar from "@/components/FilterSideBar";
import { API_URL } from "@/config/api";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "@/redux/slices/productSlice";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

const Product = () => {
  const { products } = useSelector((store) => store.product);
  const dispatch = useDispatch();

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [sortOrder, setSortOrder] = useState("default");

  // ===== FETCH PRODUCTS =====
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/product/getAllProducts`);

      if (res.data.success) {
        setAllProducts(res.data.products);
        dispatch(setProducts(res.data.products));
      }
    } catch (error) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const groupedProducts = products.reduce((acc, product) => {
    const category = product.category || "Others";

    if (!acc[category]) {
      acc[category] = [];
    }

    acc[category].push(product);
    return acc;
  }, {});
  useEffect(() => {
    getAllProducts();
  }, []);

  // ===== FILTER LOGIC =====
  useEffect(() => {
    let filtered = allProducts.filter((p) => p.isPublished);

    // 🔍 search
    if (search.trim()) {
      filtered = filtered.filter((p) =>
        p.productName?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // 📂 category
    if (category !== "All") {
      filtered = filtered.filter(
        (p) => p.category?.toLowerCase() === category.toLowerCase(),
      );
    }

    // 🏷️ brand
    if (brand !== "All") {
      filtered = filtered.filter(
        (p) => p.brand?.toLowerCase() === brand.toLowerCase(),
      );
    }

    // 🔽 sorting
    if (sortOrder === "lowToHigh") {
      filtered = [...filtered].sort((a, b) => a.productPrice - b.productPrice);
    } else if (sortOrder === "highToLow") {
      filtered = [...filtered].sort((a, b) => b.productPrice - a.productPrice);
    }

    dispatch(setProducts(filtered));
  }, [search, category, brand, sortOrder, allProducts]);

  return (
    <div className="bg-gray-50 min-h-screen pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* ===== HEADER ===== */}
        <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Explore Products
          </h1>

          <div className="flex gap-3 flex-col sm:flex-row">
            {/* 🔽 SORT */}
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-full sm:w-48 bg-white">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="lowToHigh">Price: Low → High</SelectItem>
                <SelectItem value="highToLow">Price: High → Low</SelectItem>
              </SelectContent>
            </Select>

            {/* 📱 MOBILE FILTER */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>

              <SheetContent side="left" className="w-72">
                <FilterSideBar
                  allProducts={allProducts}
                  search={search}
                  setSearch={setSearch}
                  brand={brand}
                  setBrand={setBrand}
                  category={category}
                  setCategory={setCategory}
                  sortOrder={sortOrder}
                  setSortOrder={setSortOrder}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* ===== MAIN ===== */}
        <div className="flex gap-6">
          {/* SIDEBAR */}
          <div className="hidden md:block w-72">
            <FilterSideBar
              allProducts={allProducts}
              search={search}
              setSearch={setSearch}
              brand={brand}
              setBrand={setBrand}
              category={category}
              setCategory={setCategory}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
          </div>

          {/* PRODUCTS */}
          <div className="flex-1">
            {/* LOADING */}
            {loading && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="h-48 bg-gray-200 animate-pulse rounded-lg"
                  />
                ))}
              </div>
            )}

            {/* EMPTY */}
            {!loading && products.length === 0 && (
              <div className="text-center py-20 text-gray-500">
                <p className="text-lg font-medium">No products found 😕</p>
                <p className="text-sm">Try changing filters</p>
              </div>
            )}

            {category === "All" ? (
              Object.entries(groupedProducts).map(([category, items]) => (
                <div key={category} className="mb-10">
                  {/* CATEGORY TITLE */}
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {category}
                    </h2>

                    <button className="text-sm text-blue-600 hover:underline">
                      View All
                    </button>
                  </div>

                  {/* GRID */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {items.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="mb-12">
                {/* HEADER */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800 capitalize">
                      {category}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Explore the best in {category}
                    </p>
                  </div>

                  <button className="text-sm font-medium text-blue-600 hover:underline">
                    View all →
                  </button>
                </div>

                {/* DIVIDER */}
                <div className="h-[1px] bg-gray-200 mb-6" />

                {/* GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
