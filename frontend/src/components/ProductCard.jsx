import React, { useState } from "react";
import { Button } from "./ui/button";
import { ShoppingCart } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import axios from "axios";
import { API_URL } from "@/config/api.js";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCart } from "@/redux/slices/productSlice.js";

const ProductCard = ({ product = {}, loading }) => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [adding, setAdding] = useState(false);

  const accessToken = localStorage.getItem("accessToken");

  const {
    _id,
    productImg = [],
    productPrice = 0,
    productName = "No Name",
  } = product;

  const imageUrl =
    productImg?.[0]?.url || "https://via.placeholder.com/300x300?text=No+Image";

  const addToCart = async () => {
    if (!user) {
      navigate("/auth/login ", { state: { loginStatus: "login_first" } });
      return;
    }

    try {
      setAdding(true);

      const res = await axios.post(
        `${API_URL}/cart/add`,
        { productId: _id },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      if (res.data.success) {
        toast.success("Product added to cart");
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Image */}
      <div className="aspect-square overflow-hidden">
        {loading ? (
          <Skeleton className="w-full h-full" />
        ) : (
          <img
            src={imageUrl}
            alt={productName}
            className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => navigate(`/product/${_id}`)}
          />
        )}
      </div>

      {/* Content */}
      {loading ? (
        <div className="p-3 space-y-2">
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-1/2 h-4" />
          <Skeleton className="w-full h-8" />
        </div>
      ) : (
        <div className="p-3 space-y-2">
          <h1 className="text-sm font-medium line-clamp-2 text-gray-700 min-h-[40px]">
            {productName}
          </h1>

          <h2 className="font-semibold text-lg text-gray-900">
            ₹ {productPrice}
          </h2>

          <Button
            disabled={adding}
            onClick={addToCart}
            className="w-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            {adding ? (
              "Adding..."
            ) : (
              <>
                <ShoppingCart size={18} />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
