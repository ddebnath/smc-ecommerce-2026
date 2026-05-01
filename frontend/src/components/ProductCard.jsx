import React, { useState } from "react";
import { Button } from "./ui/button";
import { ShoppingCart, Star } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { Badge } from "@/components/ui/badge";
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

  // ⭐ rating state
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

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
      navigate("/auth/login", { state: { loginStatus: "login_first" } });
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
        toast.success("Added to cart");
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="group bg-white border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
      {/* IMAGE */}
      <div className="relative aspect-square overflow-hidden">
        {loading ? (
          <Skeleton className="w-full h-full" />
        ) : (
          <>
            <img
              src={imageUrl}
              alt={productName}
              onClick={() => navigate(`/product/${_id}`)}
              className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-300"
            />
            <Badge className="absolute top-2 left-2 bg-black/70 text-white text-xs">
              New
            </Badge>
          </>
        )}
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="p-4 space-y-3">
          <Skeleton className="w-full h-4" />
          <Skeleton className="w-1/2 h-4" />
          <Skeleton className="w-full h-10" />
        </div>
      ) : (
        <div className="p-4 space-y-3">
          {/* NAME */}
          <h2 className="text-sm font-medium text-gray-800 line-clamp-2 min-h-[40px]">
            {productName}
          </h2>

          {/* ⭐ INTERACTIVE RATING */}
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, index) => {
              const starValue = index + 1;

              return (
                <Star
                  key={index}
                  size={18}
                  className={`cursor-pointer transition ${
                    starValue <= (hover || rating)
                      ? "fill-yellow-500 text-yellow-500"
                      : "text-gray-300"
                  }`}
                  onClick={() => setRating(starValue)}
                  onMouseEnter={() => setHover(starValue)}
                  onMouseLeave={() => setHover(0)}
                />
              );
            })}
            <span className="text-xs text-gray-500 ml-2">
              {rating ? `${rating}/5` : "Rate"}
            </span>
          </div>

          {/* PRICE */}
          <p className="text-lg font-semibold text-gray-900">₹{productPrice}</p>

          {/* BUTTON */}
          <Button
            disabled={adding}
            onClick={addToCart}
            className="w-full rounded-xl flex items-center justify-center gap-2"
          >
            {adding ? (
              "Adding..."
            ) : (
              <>
                <ShoppingCart size={16} />
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
