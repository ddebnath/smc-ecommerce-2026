import React from "react";
import Hero from "./components/Hero";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import Product from "../product/Product";

const Home = () => {
  const { user, accessToken } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-100">
      <Hero />
      <Product />
    </div>
  );
};

export default Home;
