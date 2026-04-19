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
    <div className="pt-10 pb-5">
      <div className="flex gap-7 max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        {/* sidebar */}
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
        {/* low to high */}
        <div className="flex flex-col flex-1">
          <div className="flex justify-end mb-4">
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-full max-w-60">
                <SelectValue placeholder="Sort by Price" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectItem value="ALL">ALL</SelectItem>
                  <SelectItem value="lowToHigh">Price: Low to High</SelectItem>
                  <SelectItem value="highToLow">Price: High to Low</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>{" "}
          </div>

          {/* product card section */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products &&
              products.map((product) => (
                <div key={product._id}>
                  <ProductCard product={product} loading={loading} />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
