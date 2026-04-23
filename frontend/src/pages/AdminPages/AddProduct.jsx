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

const AddProduct = () => {
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
        // console.log("All Products: ", products);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Bad Request");
    } finally {
      setLoading(false);
    }

    // later: send to backend
  };

  return (
    <div className="pl-[350px] py-10 pr-20 px-4 mx-auto mt-20 bg-grey-100">
      <Card className="w-full my-20">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Add Product</CardTitle>
            <CardDescription>Enter Product details below</CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-4">
              {/* Product Name */}
              <div className="grid gap-2">
                <Label>Product Name</Label>
                <Input
                  type="text"
                  name="productName"
                  placeholder="Mobile"
                  value={productData.productName}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Price */}
              <div className="grid gap-2">
                <Label>Price</Label>
                <Input
                  type="number"
                  name="productPrice"
                  placeholder="₹1000"
                  value={productData.productPrice}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Brand */}
              <div className="grid gap-2">
                <Label>Brand</Label>
                <Input
                  type="text"
                  name="brand"
                  placeholder="Apple / Samsung"
                  value={productData.brand}
                  onChange={handleChange}
                />
              </div>

              {/* Category */}
              <div className="grid gap-2">
                <Label>Category</Label>
                <Input
                  type="text"
                  name="category"
                  placeholder="Electronics"
                  value={productData.category}
                  onChange={handleChange}
                />
              </div>

              {/* Description */}
              <div className="grid gap-2">
                <Label>Description</Label>
                <textarea
                  name="productDesc"
                  rows="5"
                  className="border rounded-md p-2"
                  placeholder="Enter product description..."
                  value={productData.productDesc}
                  onChange={handleChange}
                />
              </div>

              {/* Image Upload */}
              <div className="grid gap-2">
                <ImageUpload
                  productData={productData}
                  setProductData={setProductData}
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-2">
            <Button
              className="bg-blue-600 cursor-pointer w-full"
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <span className="flex gap-1 items-center">
                  <Loader2 className="animate-spin"> please wait...</Loader2>
                </span>
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
