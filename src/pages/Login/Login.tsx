import { LoginForm } from "@/components/Login/LoginForm";
import LoginImage from "@/assets/login.webp";

const Login = () => {
  return (
    <div className="w-full lg:grid lg:min-h-svh lg:grid-cols-2 xl:min-h-svh">
      <div className="flex items-center justify-center min-h-svh p-6 py-12 md:p-10 lg:min-h-0">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src={LoginImage}
          alt="Login Image"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default Login;
