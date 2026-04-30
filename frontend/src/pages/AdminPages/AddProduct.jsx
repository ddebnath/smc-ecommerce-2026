import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ImageUpload from "@/components/ImageUpload.jsx";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { API_URL } from "@/config/api";
import { useDispatch, useSelector } from "react-redux";
import { setCart, setProducts } from "@/redux/slices/productSlice";
import { Loader2, SpaceIcon } from "lucide-react";
import store from "@/redux/store";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    productName: "",
    productPrice: "",
    brand: "",
    category: "",
    productDesc: "",
    productImg: [],
  });

  const { products } = useSelector((store) => store.product);

  const [loading, setLoading] = useState(false);

  // handle text + number inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("productName", productData.productName);
    formData.append("productPrice", productData.productPrice);
    formData.append("brand", productData.brand);
    formData.append("productDesc", productData.productDesc);
    formData.append("category", productData.category);

    if (productData.productImg.length === 0 && productData.productName === "") {
      toast.error("enter product name and atleast one image");
      return;
    }

    productData.productImg.forEach((img) => formData.append("files", img));

    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/product/add`, formData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.data.success) {
        toast.success("product added successfully");
        dispatch(setProducts([...products, res.data.product]));
        navigate("/dashboard/products");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Bad Request");
    } finally {
      setLoading(false);
    }

    // later: send to backend
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <Card className="w-full max-w-3xl shadow-xl rounded-2xl">
        <form onSubmit={handleSubmit}>
          <CardHeader className="text-center space-y-1">
            <CardTitle className="text-2xl font-bold">Add Product</CardTitle>
            <CardDescription className="text-gray-500">
              Enter product details below
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid md:grid-cols-2 gap-5">
              {/* Product Name */}
              <div className="flex flex-col gap-1">
                <Label className="text-sm font-medium">Product Name</Label>
                <Input
                  type="text"
                  name="productName"
                  placeholder="Mobile"
                  value={productData.productName}
                  onChange={handleChange}
                  className="focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Price */}
              <div className="flex flex-col gap-1">
                <Label className="text-sm font-medium">Price</Label>
                <Input
                  type="number"
                  name="productPrice"
                  placeholder="₹1000"
                  value={productData.productPrice}
                  onChange={handleChange}
                  className="focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Brand */}
              <div className="flex flex-col gap-1">
                <Label className="text-sm font-medium">Brand</Label>
                <Input
                  type="text"
                  name="brand"
                  placeholder="Apple / Samsung"
                  value={productData.brand}
                  onChange={handleChange}
                  className="focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Category */}
              <div className="flex flex-col gap-1">
                <Label className="text-sm font-medium">Category</Label>
                <Input
                  type="text"
                  name="category"
                  placeholder="Electronics"
                  value={productData.category}
                  onChange={handleChange}
                  className="focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description (full width) */}
              <div className="md:col-span-2 flex flex-col gap-1">
                <Label className="text-sm font-medium">Description</Label>
                <textarea
                  name="productDesc"
                  rows="4"
                  className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Enter product description..."
                  value={productData.productDesc}
                  onChange={handleChange}
                />
              </div>

              {/* Image Upload (full width) */}
              <div className="md:col-span-2">
                <ImageUpload
                  productData={productData}
                  setProductData={setProductData}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-center">
            <Button
              type="submit"
              disabled={loading}
              className="w-full md:w-1/2 bg-blue-600 hover:bg-blue-700 transition-all duration-200 rounded-lg text-white font-medium py-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  Please wait...
                </>
              ) : (
                "Add Product"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AddProduct;
