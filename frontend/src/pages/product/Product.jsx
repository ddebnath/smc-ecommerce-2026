import React, { useEffect, useState, useMemo } from "react";
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

const normalize = (val) => val?.trim().toLowerCase();

const Product = () => {
  const dispatch = useDispatch();
  const { products } = useSelector((store) => store.product);

  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [brand, setBrand] = useState("all");
  const [sortOrder, setSortOrder] = useState("categoryAZ");

  // ===== FETCH =====
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/product/getAllProducts`);
        if (res.data.success) {
          setAllProducts(res.data.products);
        }
      } catch {
        toast.error("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ===== FILTER + SORT =====
  const filteredProducts = useMemo(() => {
    let data = allProducts.filter((p) => p.isPublished);

    if (search.trim()) {
      data = data.filter((p) =>
        p.productName?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    if (category !== "all") {
      data = data.filter((p) => normalize(p.category) === category);
    }

    if (brand !== "all") {
      data = data.filter((p) => normalize(p.brand) === brand);
    }

    if (sortOrder === "lowToHigh") {
      data = [...data].sort((a, b) => a.productPrice - b.productPrice);
    } else if (sortOrder === "highToLow") {
      data = [...data].sort((a, b) => b.productPrice - a.productPrice);
    } else {
      data = [...data].sort((a, b) => {
        const catCompare = normalize(a.category).localeCompare(
          normalize(b.category),
        );
        if (catCompare !== 0) return catCompare;
        return (a.productName || "").localeCompare(b.productName || "");
      });
    }

    return data;
  }, [allProducts, search, category, brand, sortOrder]);

  useEffect(() => {
    dispatch(setProducts(filteredProducts));
  }, [filteredProducts, dispatch]);

  return (
    <div className="bg-gray-50 min-h-screen pt-20 pb-10">
      <div className="max-w-screen-2xl mx-auto px-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Explore Products
          </h1>

          <div className="flex gap-3 flex-col sm:flex-row">
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-full sm:w-52 bg-white">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="categoryAZ">Category A → Z</SelectItem>
                <SelectItem value="lowToHigh">Price Low → High</SelectItem>
                <SelectItem value="highToLow">Price High → Low</SelectItem>
              </SelectContent>
            </Select>

            {/* MOBILE FILTER */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>

              <SheetContent side="left" className="w-72">
                <FilterSideBar
                  {...{
                    allProducts,
                    search,
                    setSearch,
                    brand,
                    setBrand,
                    category,
                    setCategory,
                    sortOrder,
                    setSortOrder,
                  }}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* MAIN */}
        <div className="flex gap-8">
          {/* SIDEBAR */}
          <div className="hidden md:block w-64">
            <FilterSideBar
              {...{
                allProducts,
                search,
                setSearch,
                brand,
                setBrand,
                category,
                setCategory,
                sortOrder,
                setSortOrder,
              }}
            />
          </div>

          {/* PRODUCTS */}
          <div className="flex-1">
            {/* LOADING */}
            {loading && (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
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
              </div>
            )}

            {/* GRID */}
            {!loading && products.length > 0 && (
              <>
                <div className="flex justify-between mb-4">
                  <p className="text-sm text-gray-500">
                    {products.length} products found
                  </p>
                </div>

                <div className="h-[1px] bg-gray-200 mb-6" />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
