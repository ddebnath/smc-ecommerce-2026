import FilterSideBar from "@/components/FilterSideBar";
import React, { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { API_URL } from "@/config/api.js";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import { setProducts } from "@/redux/slices/productSlice";

const Product = () => {
  const { products } = useSelector((store) => store.product);
  const dispatch = useDispatch();
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("");

  const getAllProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/product/getAllProducts`);
      if (res.data.success) {
        setAllProducts(res.data.products);
        dispatch(setProducts(res.data.products));
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error(error.response?.data?.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  useEffect(() => {
    if (allProducts.length === 0) return;
    let filtered = [...allProducts];

    // filter products by name
    if (search.trim() != "") {
      filtered = filtered.filter((prod) =>
        prod.productName?.toLowerCase().includes(search.toLowerCase()),
      );
    }

    // filter products by category
    if (category.toLowerCase() !== "all") {
      filtered = filtered.filter(
        (prod) => prod.category.toLowerCase() === category.toLowerCase(),
      );
    }

    // filter products by brand
    if (brand.toUpperCase() !== "ALL") {
      filtered = filtered.filter(
        (prod) => prod.brand.toUpperCase() === brand.toUpperCase(),
      );
    }

    //filter products by low To High
    if (sortOrder === "lowToHigh") {
      filtered = filtered.sort((a, b) => a.productPrice - b.productPrice);
    } else if (sortOrder === "highToLow") {
      filtered = filtered.sort((a, b) => b.productPrice - a.productPrice);
    }

    dispatch(setProducts(filtered));
  }, [search, category, brand, sortOrder, allProducts]);

  return (
    <div className="bg-gray-50 min-h-screen pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
          <h1 className="text-2xl font-semibold text-gray-800">Products</h1>

          {/* Sort */}
          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="w-full sm:w-60 bg-white shadow-sm">
              <SelectValue placeholder="Sort by Price" />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectItem value="ALL">All</SelectItem>
                <SelectItem value="lowToHigh">Price: Low to High</SelectItem>
                <SelectItem value="highToLow">Price: High to Low</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="hidden md:block w-72">
            <div className="sticky top-24 bg-white p-4 rounded-xl shadow-sm">
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
          </div>

          {/* Products */}
          <div className="flex-1">
            {/* Loading */}
            {loading && (
              <div className="text-center py-20 text-gray-500">
                Loading products...
              </div>
            )}

            {/* Empty State */}
            {!loading && products.length === 0 && (
              <div className="text-center py-20 text-gray-500">
                No products found 😕
              </div>
            )}

            {/* Grid */}
            {!loading && products.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
