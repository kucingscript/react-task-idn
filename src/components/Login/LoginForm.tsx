import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormInput from "../FormInput/FormInput";
import { Label } from "../ui/label";
import { useAuthStore } from "@/store/auth";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { loginUser } from "@/lib/authService";
import { Button } from "../ui/button";

const loginSchema = yup.object().shape({
  email: yup.string().email().required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(10, "Password must be at least 10 characters"),
});

interface LoginFormValues {
  email: string;
  password: string;
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const res = await loginUser(data);
      if (res && res.code === 0) {
        login(res.data);
        navigate("/admin/dashboard");
      } else {
        setError("root", {
          message: res.message || "Login failed. Please try again.",
        });
      }
      /* eslint-disable  @typescript-eslint/no-explicit-any */
    } catch (error: any) {
      let errorMessage =
        "An unexpected error occurred. Please try again later.";

      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = "Invalid email or password.";
        } else if (error.response.status === 404) {
          errorMessage = "User not found.";
        }
      }

      setError("root", { message: errorMessage });
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col gap-2 text-center">
        <h1 className="font-bold text-5xl">Sign In</h1>
        <p className="text-muted-foreground ">
          Enter your email below to login to your account
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4">
          {errors.root && (
            <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md">
              {errors.root.message}
            </div>
          )}

          <FormInput<LoginFormValues>
            name="email"
            type="email"
            placeholder="hello@example.com"
            label="Email"
            required
            register={register}
            error={errors}
          />
          <div>
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <a
                href="#"
                className="ml-auto inline-block text-sm text-primary underline cursor-not-allowed"
              >
                Forgot your password?
              </a>
            </div>
            <FormInput<LoginFormValues>
              name="password"
              type="password"
              placeholder="********"
              required
              register={register}
              error={errors}
            />
          </div>
          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              className="w-full cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Login"
              )}
            </Button>
            <Button variant="outline" className="w-full cursor-not-allowed">
              Login with Google
            </Button>
          </div>
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <a
            href="#"
            className="underline underline-offset-4 cursor-not-allowed text-primary"
          >
            Sign up
          </a>
        </div>
      </form>
    </div>
  );
}
