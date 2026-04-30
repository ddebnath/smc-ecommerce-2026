import { CheckCircle2Icon, InfoIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function AlertMessage({ message = "Login to add products to the cart" }) {
  return (
    <div className="grid w-full max-w-md items-start gap-4">
      <Alert className="bg-slate-300">
        <CheckCircle2Icon />
        <AlertTitle className="text-red-600 text-2xl text-center">
          {message}
        </AlertTitle>
        <AlertDescription className="">{}</AlertDescription>
      </Alert>
    </div>
  );
}

export default AlertMessage;
