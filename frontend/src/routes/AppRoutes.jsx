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
import Dashboard from "@/pages/Dashboard/Dashboard";
import AdminSales from "@/pages/AdminPages/AdminSales";
import AddProduct from "@/pages/AdminPages/AddProduct";
import AdminProduct from "@/pages/AdminPages/AdminProduct";
import AdminOrders from "@/pages/AdminPages/AdminOrders";
import ShowUserOrders from "@/pages/AdminPages/ShowUserOrders";
import AdminUsers from "@/pages/AdminPages/AdminUsers";
import UserInfo from "@/pages/AdminPages/UserInfo";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SingleProduct from "@/pages/product/SingleProduct";
import EditProduct from "@/pages/Dashboard/EditProductDialog";
// import AddressForm from "@/pages/AddressForm";
import DeveleryAddress from "@/pages/DeleveryAddress";
import PaymentSuccessful from "@/pages/PaymentSuccessful";
import ShowSingleUserOrders from "@/pages/ShowSingleUserOrders";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />

        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route path="/product" element={<Product />} />
        <Route path="/product/:id" element={<SingleProduct />} />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/address"
          element={
            <ProtectedRoute>
              <AddressForm />
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/address1"
          element={
            <ProtectedRoute>
              <DeveleryAddress />
            </ProtectedRoute>
          }
        />
        <Route
          path="/order-success/:id"
          element={
            <ProtectedRoute>
              <PaymentSuccessful />
            </ProtectedRoute>
          }
        />

        <Route
          path="/show-user-orders/:userId"
          element={
            <ProtectedRoute>
              <ShowSingleUserOrders />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Auth Layout */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<Login />} />
        <Route path="logout" element={<Logout />} />
        <Route path="signup" element={<Signup />} />
        <Route path="verify" element={<Verify />} />
        <Route path="verify/:token" element={<VerifyEmail />} />
      </Route>

      {/* Admin Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute adminOnly={true}>
            <Dashboard />
          </ProtectedRoute>
        }
      >
        <Route path="sales" element={<AdminSales />} />
        <Route path="add-product" element={<AddProduct />} />
        <Route path="products" element={<AdminProduct />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="users/:id" element={<UserInfo />} />
        <Route path="users/orders/:userId" element={<ShowUserOrders />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
