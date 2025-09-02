import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormInput from "../FormInput/FormInput";
import { Label } from "../ui/label";

const loginSchema = yup.object().shape({
  email: yup.string().email().required("Email is required"),
  password: yup.string().required("Password is required"),
});

interface LoginFormValues {
  email: string;
  password: string;
}

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
  });

  const handleSubmit = async (data: LoginFormValues) => {
    console.log(data);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-3xl font-bold">Sign In</h1>
        <p className="text-balance text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="flex flex-col gap-4">
          <FormInput<LoginFormValues>
            name="email"
            type="email"
            placeholder="hello@example.com"
            label="Email"
            required
            register={form.register}
            error={form.formState.errors}
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
              register={form.register}
              error={form.formState.errors}
            />
          </div>
          <div className="flex flex-col gap-3">
            <Button type="submit" className="w-full cursor-pointer">
              Login
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
