import { Route, Routes } from "react-router-dom";
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
import VerifyEmail from "../pages/Auth/VerifyEmail";
import Dashboard from "../pages/Dashboard/Dashboard";
import AddProduct from "../pages/AdminPages/AddProduct";
import AdminProduct from "../pages/AdminPages/AdminProduct";
import AdminOrders from "../pages/AdminPages/AdminOrders";
import AdminUsers from "../pages/AdminPages/AdminUsers";
import UserInfo from "../pages/AdminPages/UserInfo";
import ProtectedRoute from "../components/ProtectedRoute";
import SingleProduct from "../pages/product/SingleProduct";
import DeveleryAddress from "../pages/DeleveryAddress";
import PaymentSuccessful from "../pages/PaymentSuccessful";
import ShowSingleUserOrders from "../pages/ShowSingleUserOrders";
import Logout from "../pages/Auth/Logout";
import AdminDashBoard from "@/pages/AdminPages/AdminDashBoard";
import CashOnDelivery from "@/pages/payment/CashOnDelevery";
import ProductAllProduct from "@/pages/ProductAdminPages/ProductAllProduct";
import ProductAddProduct from "@/pages/ProductAdminPages/ProductAddProduct";
import ProductOrdersProduct from "@/pages/ProductAdminPages/ProductOrdersProduct";
import ProductPanel from "@/pages/Dashboard/ProductPanel";
import ProductDashBoard from "@/pages/ProductAdminPages/ProductDashBoard";
import ImageGallery from "@/pages/ImageGallery/ImageGallery";
import CreateEvent from "@/pages/EventPages/CreateEvent";
import EventDetails from "@/pages/EventPages/EventDetails";
import Events from "@/pages/EventPages/Events";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Layout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
        <Route path="/event" element={<Events />} />
        <Route
          path="/profile/:userId"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/product/:id" element={<SingleProduct />} />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/address1"
          element={
            <ProtectedRoute>
              <DeveleryAddress />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/COD"
          element={
            <ProtectedRoute>
              <CashOnDelivery />
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
        <Route index element={<AdminDashBoard />} />
        <Route path="add-product" element={<AddProduct />} />
        <Route path="products" element={<AdminProduct />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="users/:id" element={<UserInfo />} />
        <Route path="users/orders/:userId" element={<ShowSingleUserOrders />} />

        {/* Event */}
        <Route path="events/create" element={<CreateEvent />} />
      </Route>

      {/* Product Ownder */}
      <Route
        path="/product-owner-dashboard"
        element={
          <ProtectedRoute productOwner={true}>
            <ProductPanel />
          </ProtectedRoute>
        }
      >
        <Route index element={<ProductDashBoard />} />
        <Route path="add-product" element={<ProductAddProduct />} />
        <Route path="products" element={<ProductAllProduct />} />
        <Route path="orders" element={<ProductOrdersProduct />} />
        <Route path="events/create" element={<CreateEvent />} />

        {/* Event */}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
