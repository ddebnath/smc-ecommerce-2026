import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { API_URL } from "@/config/api";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/userSlice";
import { Loader2 } from "lucide-react";

const Logout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const accessToken = localStorage.getItem("accessToken");

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

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      <p className="text-gray-600 text-sm">Logging you out...</p>
    </div>
  );
};

export default Logout;
