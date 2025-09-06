import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { IconBrandBluesky } from "@tabler/icons-react";
import { useAuthStore } from "@/store/auth";

const Home = () => {
  const { isLoggedIn, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isAdmin = user?.level?.toLowerCase() === "admin";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center px-4">
          <Link to="#" className="mr-6 flex items-center gap-2">
            <IconBrandBluesky className="h-6 w-6" />
            <span className="sr-only">Indo Digital Niaga</span>
          </Link>
          <nav className="hidden items-center gap-6 text-base font-medium md:flex">
            <Link
              to="/"
              className="text-foreground/60 transition-colors hover:text-foreground/80"
            >
              Home
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-4">
            <Button asChild>
              {isLoggedIn ? (
                <>
                  {isAdmin && (
                    <Button asChild>
                      <Link to="/admin/dashboard">Admin</Link>
                    </Button>
                  )}
                  <Button variant="outline" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <Button asChild>
                  <Link to="/login">Login</Link>
                </Button>
              )}
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-4 w-4" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <nav className="grid gap-2 text-base font-medium p-4">
                  <Link
                    to="#"
                    className="flex items-center gap-2 text-lg font-semibold"
                  >
                    <IconBrandBluesky className="h-6 w-6" />
                    <span className="sr-only">Indo Digital Niaga</span>
                  </Link>
                  <Link to="/" className="hover:text-foreground">
                    Home
                  </Link>
                  <Link
                    to="/login"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    Login
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="flex h-[calc(100vh-3.5rem)] items-center justify-center">
          <div className="container px-4 text-center md:px-6">
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Selamat Datang di Platform Kami
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Solusi modern untuk manajemen aset Anda. Efisien, andal, dan
                mudah digunakan.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
