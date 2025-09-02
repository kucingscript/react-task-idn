import { LoginForm } from "@/components/Login/LoginForm";

const Login = () => {
  return (
    <div className="w-full lg:grid lg:min-h-svh lg:grid-cols-2 xl:min-h-svh">
      <div className="flex items-center justify-center p-6 py-12 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src="https://plus.unsplash.com/premium_vector-1726498072933-f6112c1b1396?q=80&w=1077&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Login Image"
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  );
};

export default Login;
