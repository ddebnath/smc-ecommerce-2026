import { Input } from "@/components/ui/input";
import { Edit2, Search, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import EditProductDialog from "../Dashboard/EditProductDialog";
import axios from "axios";
import store from "@/redux/store.js";
import { toast } from "sonner";
import { API_URL } from "@/config/api";
import { setProducts } from "@/redux/slices/productSlice";

const ProductAddProduct = () => {
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [products, setProducts] = useState([]);

  const getOwnerProduct = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/product/get-product-owner-product`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );

      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (error) {
      console.log("Error : ", error);
    }
  };

  let filteredProducts = products.filter(
    (p) =>
      p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (sortOrder === "lowToHigh") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => a.productPrice - b.productPrice,
    );
  }

  if (sortOrder === "highToLow") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => b.productPrice - a.productPrice,
    );
  }

  const handleDelete = async (product) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmDelete) return;

    try {
      setLoading(true);

      const res = await axios.delete(
        `${API_URL}/product/product-delete/${product._id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOwnerProduct();
  }, [products]);

  return (
    <div className="pl-[350px] py-20 pr-20 flex flex-col gap-3 min-h-screen bg-gray-100">
      {/* Top bar */}
      <div className="flex justify-between">
        <div className="relative bg-white rounded-lg">
          <Input
            type="text"
            placeholder="search product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[400px] h-[40px]"
          />
          <Search className="absolute right-3 top-2 text-gray-400" />
        </div>

        <Select onValueChange={(value) => setSortOrder(value)}>
          <SelectTrigger className="w-full max-w-60">
            <SelectValue placeholder="Sort by Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="lowToHigh">Price: Low to High</SelectItem>
              <SelectItem value="highToLow">Price: High To Low</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-10">
        {filteredProducts?.map((product) => (
          <Card key={product._id} className="px-4 mt-2">
            <div className="flex justify-between items-center">
              <div className="flex gap-2 items-center">
                <img
                  src={product.productImg?.[0]?.url}
                  alt=""
                  className="w-20 h-20"
                />
                <h1 className="w-120 text-gray-700 line-clamp-3">
                  {product.productName}
                </h1>
              </div>

              <h1 className="font-bold text-gray-700">
                ₹ {product.productPrice}
              </h1>

              <div className="flex gap-3 items-center">
                <Button
                  variant="outline"
                  className="border-none"
                  onClick={() => {
                    setSelectedProduct(product); // 👈 store full product
                    setOpen(true);
                  }}
                >
                  <Edit2 className="text-green-500" />
                </Button>

                <Button variant="outline" onClick={() => handleDelete(product)}>
                  <Trash2 className="text-red-500 cursor-pointer" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {/* ✅ Single Dialog (outside map) */}
      {open && selectedProduct && (
        <EditProductDialog
          open={open}
          setOpen={setOpen}
          product={selectedProduct} // 👈 pass full product
        />
      )}
    </div>
  );
};

export default ProductAddProduct;
