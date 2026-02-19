import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="empty-float mb-6">
          <span className="text-6xl">🔍</span>
        </div>
        <h1 className="mb-2 text-3xl font-bold text-foreground">404</h1>
        <p className="mb-6 text-muted-foreground">Page not found</p>
        <Button asChild className="cta-pulse">
          <a href="/">Return to Dashboard</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
