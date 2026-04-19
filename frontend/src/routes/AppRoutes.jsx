import { Routes, Route } from "react-router-dom";

// Layouts
import MainLayout from "../layouts/MainLayout";
import AuthLayout from "../layouts/AuthLayout";

// Pages
import Home from "../pages/Home/Home";
import Profile from "../pages/profile/Profile";
import Cart from "../pages/Cart/Cart.jsx";
import Product from "../pages/product/Product";
import Login from "../pages/Auth/Login";
import Signup from "../pages/Auth/Signup";
import Verify from "../pages/Auth/Verify";
import VerifyEmail from "@/pages/Auth/VerifyEmail";
import Logout from "@/pages/Auth/Logout";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/product" element={<Product />} />
        <Route path="cart" element={<Cart />} />
      </Route>

      {/* Auth Layout */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="logout" element={<Logout />} />
        <Route path="signup" element={<Signup />} />
        <Route path="verify" element={<Verify />} />
        <Route path="verify/:token" element={<VerifyEmail />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
