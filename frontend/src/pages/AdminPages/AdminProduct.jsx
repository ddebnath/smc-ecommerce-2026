import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Edit2, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { API_URL } from "@/config/api";
import { setProducts } from "@/redux/slices/productSlice";
import EditProductDialog from "../Dashboard/EditProductDialog";
import { useNavigate } from "react-router-dom";

const AdminProduct = () => {
  const { products } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const accessToken = localStorage.getItem("accessToken");

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [loadingId, setLoadingId] = useState(null);

  // 🔍 Filter
  let filteredProducts = products.filter((p) =>
    [p.productName, p.brand, p.category]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );

  // 🔃 Sort
  if (sortOrder === "lowToHigh") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => a.productPrice - b.productPrice,
    );
  } else if (sortOrder === "highToLow") {
    filteredProducts = [...filteredProducts].sort(
      (a, b) => b.productPrice - a.productPrice,
    );
  }

  // 🗑 Delete Product
  const handleDelete = async (product) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );
    if (!confirmDelete) return;

    try {
      setLoadingId(product._id);

      const res = await axios.delete(
        `${API_URL}/product/delete/${product._id}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      if (res.data.success) {
        toast.success(res.data.message);

        const updatedProducts = products.filter((p) => p._id !== product._id);
        dispatch(setProducts(updatedProducts));
      }
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Delete failed");
    } finally {
      setLoadingId(null);
    }
  };

  // 🔁 Toggle Publish
  const handleTogglePublish = async (product) => {
    try {
      setLoadingId(product._id);

      const updatedStatus = !product.isPublished;

      const res = await axios.put(
        `${API_URL}/product/update/${product._id}`,
        { isPublished: updatedStatus },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      if (res.data.success) {
        toast.success(res.data.message);

        const updatedProducts = products.map((p) =>
          p._id === product._id ? { ...p, isPublished: updatedStatus } : p,
        );

        dispatch(setProducts(updatedProducts));
      }
    } catch (error) {
      console.error("Toggle failed:", error);
      toast.error("Update failed");
    } finally {
      setLoadingId(null);
    }
  };

  const getAllProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/product/getAllProducts`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.data.success) {
        dispatch(setProducts(res.data.products));
      }
    } catch (error) {}
  };

  useEffect(() => {
    (getAllProducts(), [products, handleDelete, handleTogglePublish]);
  });

  return (
    <div className="pl-[350px] py-20 pr-20 min-h-screen bg-gray-100 flex flex-col gap-5">
      {/* 🔝 Top Bar */}
      <div className="flex justify-between items-center">
        {/* Search */}
        <div className="relative bg-white rounded-lg">
          <Input
            placeholder="Search product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[400px] h-[40px]"
          />
          <Search className="absolute right-3 top-2 text-gray-400" />
        </div>

        {/* Sort */}
        <Select onValueChange={(value) => setSortOrder(value)}>
          <SelectTrigger className="w-60">
            <SelectValue placeholder="Sort by Price" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="lowToHigh">Price: Low to High</SelectItem>
              <SelectItem value="highToLow">Price: High to Low</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* 📦 Product List */}
      <div className="mt-5 flex flex-col gap-3">
        {filteredProducts.map((product) => (
          <Card key={product._id} className="p-4">
            <div className="flex justify-between items-center">
              {/* Left */}
              <div className="flex gap-3 items-center">
                <img
                  src={product.productImg?.[0]?.url}
                  alt=""
                  className="w-20 h-20 object-cover rounded"
                />
                <h1 className="text-gray-700 line-clamp-2 max-w-[300px]">
                  {product.productName}
                </h1>
              </div>

              {/* Right */}
              <div className="flex items-center gap-6">
                {/* Price */}
                <h1 className="font-bold text-gray-700">
                  ₹ {product.productPrice}
                </h1>

                {/* 🔥 Publish Switch */}
                <div className="flex items-center gap-2">
                  <Switch
                    checked={product.isPublished}
                    disabled={loadingId === product._id}
                    onCheckedChange={() => handleTogglePublish(product)}
                  />
                  <span
                    className={`text-sm font-semibold px-2 py-1 rounded-full ${
                      product.isPublished
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.isPublished ? "Published" : "Unpublished"}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSelectedProduct(product);
                      setOpen(true);
                    }}
                  >
                    <Edit2 className="text-green-500" />
                  </Button>

                  <Button
                    variant="outline"
                    disabled={loadingId === product._id}
                    onClick={() => handleDelete(product)}
                  >
                    <Trash2 className="text-red-500" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* ✏️ Edit Dialog */}
      {open && selectedProduct && (
        <EditProductDialog
          open={open}
          setOpen={setOpen}
          product={selectedProduct}
        />
      )}
    </div>
  );
};

export default AdminProduct;
