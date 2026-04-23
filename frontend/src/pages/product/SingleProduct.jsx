import BreadCrums from "@/components/BreadCrums";
import ProductDesc from "@/components/ProductDesc";
import ProductImg from "@/components/ProductImg";
import store from "@/redux/store";
import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const SingleProduct = () => {
  const params = useParams();
  const productId = params.id;
  const { products } = useSelector((store) => store.product);
  const product = products.find((item) => item._id === productId);

  return (
    <div className="pt-10 max-w-[80%] h-screen mx-auto">
      <BreadCrums product={product} />
      <div className="mt-10 grid grid-cols-2 items-start">
        <ProductImg images={product.productImg} />
        <ProductDesc product={product} />
      </div>
    </div>
  );
};

export default SingleProduct;
