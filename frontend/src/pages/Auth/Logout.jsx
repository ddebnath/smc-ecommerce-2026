import { useEffect, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { API_URL } from "@/config/api";

const Logout = () => {
  const { accessToken, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const verifyLogout = async () => {
    try {
      const res = await axios.post(`${API_URL}/user/auth/logout`, null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.data.success) {
        logout(); // context logout to clear local state
        toast.success(res.data.message, {
          position: "top-center",
        });
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Logout error:", error);
      // still logout locally if API fails
      logout();
      navigate("/", { replace: true });
    }
  };

  useEffect(() => {
    verifyLogout();
  }, []);

  return <p className="text-center mt-10">Logging out...</p>;
};

export default Logout;
