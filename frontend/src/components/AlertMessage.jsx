import { CheckCircle2Icon, InfoIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function AlertMessage() {
  return (
    <div className="grid w-full max-w-md items-start gap-4">
      <Alert>
        <CheckCircle2Icon />
        <AlertTitle className="text-red-600 text-center">
          {" "}
          Login First
        </AlertTitle>
        <AlertDescription> Login to add products to the cart</AlertDescription>
      </Alert>
    </div>
  );
}

export default AlertMessage;
