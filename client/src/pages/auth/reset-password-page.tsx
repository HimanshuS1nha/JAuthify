import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

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

import { ToastHelper } from "@/helpers/toast-helper";
import { parseErrorToString } from "@/helpers/parse-error-to-string";

import {
  resetPasswordValidator,
  type resetPasswordValidatorType,
} from "@/validators/reset-password-validator";

import { apiRoutes } from "@/constants/api-routes";
import { routes } from "@/constants/routes";

const ResetPasswordPage = () => {
  const navigate = useNavigate();

  const { mutate: handleResetPassword, isPending } = useMutation({
    mutationKey: ["reset-password"],
    mutationFn: async (values: resetPasswordValidatorType) => {
      const { data } = await axios.post(apiRoutes.auth.resetPassword, values);

      return data as { message: string };
    },
    onSuccess: (data) => {
      ToastHelper.successToast(data.message);
      navigate(routes.auth.login, { replace: true });
    },
    onError: (error) => {
      ToastHelper.errorToast(parseErrorToString(error));
    },
  });

  const form = useForm({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validators: {
      onBlur: resetPasswordValidator,
      onSubmit: resetPasswordValidator,
    },
    onSubmit: ({ value }) => {
      handleResetPassword(value);
    },
  });
  return (
    <Card className="w-[50%]">
      <CardHeader>
        <CardTitle className="font-semibold">Reset Password</CardTitle>
        <CardDescription>Enter the new password</CardDescription>
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
            name="newPassword"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>New Password</FieldLabel>
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

      <CardFooter>
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
      </CardFooter>
    </Card>
  );
};

export default ResetPasswordPage;
