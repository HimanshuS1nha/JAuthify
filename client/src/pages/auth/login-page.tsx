import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { axios } from "@/lib/axios";

import {
  loginValidator,
  type loginValidatorType,
} from "@/validators/login-validator";

import { ToastHelper } from "@/helpers/toast-helper";

import { apiRoutes } from "@/constants/api-routes";
import { queryKeys } from "@/constants/query-keys";
import { routes } from "@/constants/routes";

import type { UserType } from "@/types";

const LoginPage = () => {
  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { mutate: handleLogin, isPending } = useMutation({
    mutationKey: ["login"],
    mutationFn: async (values: loginValidatorType) => {
      const { data } = await axios.post(apiRoutes.auth.login, values);

      return data as UserType;
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.getUser });

      if (!data.organizationId) {
        navigate(routes.auth.createOrganization);
      } else {
        navigate(routes.dashboard, { replace: true });
      }

      ToastHelper.successToast("Logged in successfully");
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onBlur: loginValidator,
      onSubmit: loginValidator,
    },
    onSubmit: ({ value }) => {
      handleLogin(value);
    },
  });
  return (
    <Card className="w-[50%]">
      <CardHeader>
        <CardTitle className="font-semibold">Welcome Back</CardTitle>
        <CardDescription>Signin to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="login-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex flex-col gap-y-5"
        >
          <form.Field
            name="email"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    name={field.name}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="john.doe@example.com"
                    aria-invalid={isInvalid}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="password"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    name={field.name}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="********"
                    aria-invalid={isInvalid}
                    type="password"
                    className="placeholder:text-gray-500"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}

                  <div className="flex justify-end">
                    <button className="text-primary font-semibold text-sm">
                      Forgot Password?
                    </button>
                  </div>
                </Field>
              );
            }}
          />
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-y-3">
        <Field orientation="horizontal">
          <Button
            type="button"
            variant="destructive"
            onClick={() => form.reset()}
            disabled={isPending}
          >
            Reset
          </Button>
          <Button type="submit" form="login-form" disabled={isPending}>
            Login
          </Button>
        </Field>

        <div className="flex justify-center">
          <p>
            Don&apos;t have an account?{" "}
            <Link to={"/register"} className="text-primary font-semibold">
              Register
            </Link>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginPage;
