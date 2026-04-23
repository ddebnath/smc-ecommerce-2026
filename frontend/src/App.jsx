import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import AuthProvider from "./context/AuthProvider";
import { Toaster } from "sonner";
import { CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react";

// Optional: global providers
// import { AuthProvider } from "./context/AuthContext";

const App = () => {
  return (
    <>
      <Toaster
        position="bottom-right"
        richColors
        expand
        closeButton
        visibleToasts={4}
        gap={10}
        icons={{
          success: <CheckCircle className="text-green-600" />,
          error: <XCircle className="text-red-600" />,
          info: <Info className="text-blue-600" />,
          warning: <AlertTriangle className="text-yellow-600" />,
        }}
        toastOptions={{
          duration: 3000,
          classNames: {
            toast:
              "rounded-2xl border bg-white shadow-md px-5 py-4 flex gap-3 items-start",
            title: "text-sm font-semibold text-gray-900",
            description: "text-sm text-gray-500",
            success: "bg-green-50 text-green-700 border-green-200",
            error: "bg-red-50 text-red-700 border-red-200",
            info: "bg-blue-50 text-blue-700 border-blue-200",
            warning: "bg-yellow-50 text-yellow-700 border-yellow-200",
          },
        }}
      />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </>
  );
};

export default App;
