import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
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
  registerValidator,
  type registerValidatorType,
} from "@/validators/register-validator";

import { ToastHelper } from "@/helpers/toast-helper";

import { apiRoutes } from "@/constants/api-routes";
import { routes } from "@/constants/routes";

const RegisterPage = () => {
  const navigate = useNavigate();

  const { mutate: handleRegister, isPending } = useMutation({
    mutationKey: ["register"],
    mutationFn: async (values: registerValidatorType) => {
      const { data } = await axios.post(apiRoutes.auth.register, values);

      return data as { message: string };
    },
    onSuccess: (data, { email }) => {
      ToastHelper.successToast(data.message);
      navigate(routes.auth.verifyEmail(email));
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validators: {
      onBlur: registerValidator,
      onSubmit: registerValidator,
    },
    onSubmit: ({ value }) => {
      handleRegister(value);
    },
  });
  return (
    <Card className="w-[50%]">
      <CardHeader>
        <CardTitle className="font-semibold">Welcome to JAuthify</CardTitle>
        <CardDescription>Create an account to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="register-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex flex-col gap-y-5"
        >
          <form.Field
            name="name"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    name={field.name}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="John Doe"
                    aria-invalid={isInvalid}
                    className="placeholder:text-gray-500"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
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
                </Field>
              );
            }}
          />
          <form.Field
            name="confirmPassword"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Confirm Password</FieldLabel>
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
          <Button type="submit" form="register-form" disabled={isPending}>
            Submit
          </Button>
        </Field>

        <div className="flex justify-center">
          <p>
            Already have an account?{" "}
            <Link
              to={routes.auth.login()}
              className="text-primary font-semibold"
            >
              Login
            </Link>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RegisterPage;
