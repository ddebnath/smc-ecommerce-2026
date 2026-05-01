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
  const images = [
    // earrings
    {
      url: "https://images.pexels.com/photos/7349539/pexels-photo-7349539.jpeg",
      category: "Fashion",
    },
    // 🍰 Cakes
    {
      url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop",
      category: "Cake",
    },
    {
      url: "https://images.unsplash.com/photo-1601979031925-424e53b6caaa?w=500&auto=format&fit=crop",
      category: "Cake",
    },
    {
      url: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&auto=format&fit=crop",
      category: "Cake",
    },
    {
      url: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500&auto=format&fit=crop",
      category: "Cake",
    },

    // 🍔 Snacks
    {
      url: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop",
      category: "Snacks",
    },
    {
      url: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=500&auto=format&fit=crop",
      category: "Snacks",
    },
    {
      url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop",
      category: "Snacks",
    },

    // 🍹 Drinks
    {
      url: "https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop",
      category: "Drinks",
    },
    {
      url: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop",
      category: "Drinks",
    },
    {
      url: "https://images.unsplash.com/photo-1510627498534-cf7e9002facc?w=500&auto=format&fit=crop",
      category: "Drinks",
    },
    {
      url: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=500&auto=format&fit=crop",
      category: "Drinks",
    },

    // 🍕 Meals
    {
      url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&auto=format&fit=crop",
      category: "Meals",
    },
    {
      url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop",
      category: "Meals",
    },
    {
      url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop",
      category: "Meals",
    },

    // 🥐 Bakery
    {
      url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop",
      category: "Bakery",
    },
    {
      url: "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?w=500&auto=format&fit=crop",
      category: "Bakery",
    },
    {
      url: "https://images.unsplash.com/photo-1587731608655-8c64b0f6c0d4?w=500&auto=format&fit=crop",
      category: "Bakery",
    },
  ];

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
