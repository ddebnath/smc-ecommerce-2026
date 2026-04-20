import React from "react";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import axios from "axios";
import { API_URL } from "@/config/api.js";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { setCart } from "@/redux/slices/productSlice.js";
import store from "@/redux/store";

const ProductCard = ({ product, loading }) => {
  const { user } = useSelector((store) => store.user);
  const { productImg, productPrice, productName } = product;
  const accessToken = localStorage.getItem("accessToken");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addToCart = async (productId) => {
    if (!user) {
      toast.success("login to add products to the Cart");
    }

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
      console.log("Error : ", error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden h-max">
      <div className="w-full h-full aspect-square overflow-hidden">
        {loading ? (
          <Skeleton className="w-full h-full rounded-lg" />
        ) : (
          <img
            src={productImg[0]?.url}
            alt=""
            className="w-full h-full transition-transform duration-300 hover:scale-105"
          />
        )}
      </div>
      {loading ? (
        <div className="px-2 space-y-2 my-2">
          <Skeleton className="w-[200px] h-4" />
          <Skeleton className="w-[100px] h-4" />
          <Skeleton className="w-[150px] h-8" />
        </div>
      ) : (
        <div className="p-2 space-y-2 my-2">
          <h1 className="mx-2 font-semibold h-12 line-clamp-2 text-gray-500">
            {productName}
          </h1>
          <h2 className="mx-2 font-bold">₹. {productPrice}</h2>
          <Button
            className="bg-blue-600 mb-3 w-full"
            text="text-white"
            hover="hover:bg-blue-600"
            onClick={() => {
              addToCart(product._id);
            }}
          >
            <ShoppingCart />
            Add to card
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
