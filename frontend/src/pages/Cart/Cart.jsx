import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { API_URL } from "@/config/api";
import store from "@/redux/store";
import { setCart } from "@/redux/slices/productSlice";
import axios from "axios";
import { toast } from "sonner";

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart } = useSelector((store) => store.product);

  const accessToken = localStorage.getItem("accessToken");

  const loadCart = async () => {
    try {
      const res = await axios.get(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (res.data.success) dispatch(setCart(res.data.cart));
    } catch (error) {
      console.log("cart loading error : ", error);
    }
  };

  const handleRemove = async (productId) => {
    try {
      const res = await axios.delete(`${API_URL}/cart/remove`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        data: { productId },
      });

      if (res.data.success) {
        dispatch(setCart(res.data.cart));
        toast.success("product has been removed from cart");
      }
    } catch (error) {
      console.log("remove item error : ", error);
    }
  };

  const handleUpdateQuantity = async (productId, type) => {
    try {
      const res = await axios.put(
        `${API_URL}/cart/update`,
        { productId, type },
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );

      if (res.data.success) {
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      console.log("Quantity Error : ", error);
    }
  };

  const totalItems =
    cart?.items && Array.isArray(cart.items)
      ? cart.items.reduce((acc, item) => acc + (item?.quantity ?? 0), 0)
      : 0;

  const subtotal =
    cart?.items && Array.isArray(cart.items)
      ? cart.items.reduce(
          (acc, item) =>
            acc + (item?.quantity ?? 0) * (item?.productId?.productPrice ?? 0),
          0,
        )
      : 0;

  useEffect(() => {
    loadCart();
  }, [dispatch]);

  return (
    <div className="pt-20 bg-slate-100 min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {cart?.items?.length > 0 ? (
          <>
            <header className="mb-8 flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white/80 px-6 py-6 shadow-sm sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
                  Shopping Cart
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                  Order Details
                </h1>
              </div>
              <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-600 shadow-inner">
                {totalItems} item{totalItems === 1 ? "" : "s"} selected
              </div>
            </header>

            <div className="grid gap-6 lg:grid-cols-[1.8fr_0.9fr]">
              <section className="space-y-4">
                {cart?.items?.map((product, index) => {
                  const imageUrl = product?.productId?.productImg?.[0]?.url;
                  const name = product?.productId?.productName;
                  const price = product?.productId?.productPrice || 0;
                  const quantity = product?.quantity || 1;
                  const lineTotal = quantity * price;

                  return (
                    <Card
                      key={index}
                      className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm"
                    >
                      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative h-24 w-24 overflow-hidden rounded-3xl bg-slate-100">
                            <img
                              src={imageUrl}
                              alt={name ?? "cart item"}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 max-w-60">
                            <h2 className="text-base font-semibold text-slate-900 truncate">
                              {name}
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                              {quantity} x ₹{price.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 items-center">
                          <div className="flex flex-col gap-2 rounded-3xl bg-slate-50 px-3 py-2 text-right text-slate-700">
                            <span className="text-sm text-slate-500">
                              Quantity
                            </span>

                            <div className="flex gap-2 items-center">
                              <Button
                                variant="outline"
                                onClick={() =>
                                  handleUpdateQuantity(
                                    product.productId._id,
                                    "decrease",
                                  )
                                }
                              >
                                -
                              </Button>
                              <span className="text-base font-medium text-slate-900">
                                {quantity}
                              </span>
                              <Button
                                variant="outline"
                                onClick={() =>
                                  handleUpdateQuantity(
                                    product.productId._id,
                                    "increase",
                                  )
                                }
                              >
                                +
                              </Button>
                            </div>

                            <span className="text-sm text-slate-500">
                              sub total
                            </span>
                            <span className="text-lg font-semibold text-slate-900">
                              ₹{lineTotal.toLocaleString()}
                            </span>
                          </div>
                          <div>
                            <Button
                              variant="outline"
                              className="border-none p-2 m-2 cursor-pointer"
                              onClick={() =>
                                handleRemove(product?.productId._id)
                              }
                            >
                              <p className="flex flex-col justify-center items-center">
                                <Trash2 /> Remove
                              </p>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </section>

              <aside className="space-y-4">
                <Card className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
                        Order summary
                      </p>
                      <h2 className="mt-3 text-2xl font-semibold text-slate-900">
                        ₹{subtotal?.toLocaleString()}
                      </h2>
                    </div>

                    <div className="space-y-3 rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">
                      <div className="flex items-center justify-between">
                        <span>Total items</span>
                        <span>{totalItems}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Subtotal</span>
                        <span>₹{subtotal?.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Taxes calculated at checkout</span>
                      </div>
                    </div>

                    <Button
                      onClick={() => navigate("/address")}
                      className="w-full rounded-2xl bg-primary px-4 py-3 text-base font-semibold text-white hover:bg-primary/90"
                    >
                      Proceed to Checkout
                    </Button>
                    <div className="flex justify-center items-center">
                      <Link
                        to="/product"
                        className=" w-full rounded-2xl px-4 py-3 text-base"
                      >
                        <p className=" text-center bg-blue-600 rounded-2xl text-white p-1 font-semibold">
                          Continue shopping
                        </p>
                      </Link>
                    </div>
                  </div>
                </Card>
              </aside>
            </div>
          </>
        ) : (
          <div className="mx-auto flex min-h-[60vh] flex-col items-center justify-center rounded-[32px] border border-dashed border-slate-300 bg-white/90 px-8 py-12 text-center shadow-sm">
            <p className="text-2xl font-semibold text-slate-900">
              Your cart is empty
            </p>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
              Add products to your cart and they will appear here with a neat
              order summary.
            </p>
            <div className="flex justify-center items-center">
              <Button
                className="bg-blue-600"
                onClick={() => {
                  navigate("/product");
                }}
              >
                Start Shopping
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
