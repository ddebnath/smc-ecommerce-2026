import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { API_URL } from "@/config/api";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/userSlice";

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accessToken = localStorage.getItem("accessToken"); // Get access token from local storage

  const verifyLogout = async () => {
    try {
      const res = await axios.post(`${API_URL}/user/auth/logout`, null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.data.success) {
        dispatch(setUser(null));
        localStorage.removeItem("accessToken");

        toast.success(res.data.message, {
          position: "top-center",
        });
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("Logout error:", error);
      dispatch(setUser(null));
      localStorage.removeItem("accessToken");
      navigate("/", { replace: true });
    }
  };

  useEffect(() => {
    verifyLogout();
  }, []);

  return <p className="text-center mt-10">Logging out...</p>;
};

export default Logout;
