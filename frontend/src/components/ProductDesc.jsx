import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { API_URL } from "@/config/api";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setCart } from "@/redux/slices/productSlice";

const ProductDesc = ({ product }) => {
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();

  const addToCart = async (productId) => {
    try {
      const res = await axios.post(
        `${API_URL}/cart/add`,
        { productId },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );

      if (res.data.success) {
        toast.success("product added to cart");
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      console.log("Product Description Page : ", error);
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-bond text-3xl text-grey-500">
        {" "}
        {product.productName}
      </h1>
      <p className="text-grey-500 text-2xl ">
        {product.category} | {product.brand}
      </p>
      <h2 className="text-blue-700 font-bold text-2xl">
        ₹{product.productPrice}
      </h2>
      <p className="line-clamp-10 text-muted-foreground">
        {product.productDesc}
      </p>

      <div className="flex gap-2 items-center w-[300px]">
        <p className="text-grey-500 font-semibold">Quantity : </p>
        <Input
          type="number"
          className="w-15"
          defaultValue={1}
          onChange={(e) => {
            if (e.target.value < 1) e.target.value = 1;
          }}
        />
      </div>

      <Button
        onClick={() => addToCart(product._id)}
        className="bg-blue-600 w-max"
      >
        Add to Cart
      </Button>
    </div>
  );
};

export default ProductDesc;
