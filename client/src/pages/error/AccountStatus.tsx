import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertTriangle, Mail } from "lucide-react";
import { useAppSelector } from "@/app/hooks";
import { ROUTES } from "@/lib/constants";

export default function AccountStatus() {
  const { user } = useAppSelector((state) => state.auth);

  const getStatusInfo = () => {
    if (user?.status === "blocked") {
      return {
        title: "Account Blocked",
        description: "Your account has been blocked due to policy violations.",
        message:
          "If you believe this is an error, please contact our support team for assistance.",
      };
    }
    if (user?.status === "suspended") {
      return {
        title: "Account Suspended",
        description: "Your account has been temporarily suspended.",
        message:
          "Please contact support to resolve any outstanding issues and reactivate your account.",
      };
    }
    return {
      title: "Account Status",
      description: "There is an issue with your account.",
      message: "Please contact support for more information.",
    };
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-center">{statusInfo.title}</CardTitle>
          <CardDescription className="text-center">
            {statusInfo.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            {statusInfo.message}
          </p>
          <div className="flex flex-col gap-2">
            <Button asChild>
              <a href="mailto:support@ridebooking.com">
                <Mail className="mr-2 h-4 w-4" />
                Contact Support
              </a>
            </Button>
            <Button variant="outline" asChild>
              <Link to={ROUTES.HOME}>Go to Homepage</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
