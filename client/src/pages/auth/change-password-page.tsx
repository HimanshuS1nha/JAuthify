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

import {
  changePasswordValidator,
  type changePasswordValidatorType,
} from "@/validators/change-password-validator";

import { ToastHelper } from "@/helpers/toast-helper";
import { parseErrorToString } from "@/helpers/parse-error-to-string";

import { apiRoutes } from "@/constants/api-routes";
import { routes } from "@/constants/routes";

const ChangePasswordPage = () => {
  const navigate = useNavigate();

  const { mutate: handleChangePassword, isPending } = useMutation({
    mutationKey: ["change-password"],
    mutationFn: async (values: changePasswordValidatorType) => {
      const { data } = await axios.post(apiRoutes.auth.changePassword, values);

      return data as { message: string };
    },
    onSuccess: (data) => {
      ToastHelper.successToast(data.message);
      navigate(routes.dashboard);
    },
    onError: (error) => {
      ToastHelper.errorToast(parseErrorToString(error));
    },
  });
  const form = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validators: {
      onBlur: changePasswordValidator,
      onSubmit: changePasswordValidator,
    },
    onSubmit: ({ value }) => {
      handleChangePassword(value);
    },
  });
  return (
    <Card className="w-[50%]">
      <CardHeader>
        <CardTitle className="font-semibold">Change Password</CardTitle>
        <CardDescription>Change the password to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="change-password-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex flex-col gap-y-5"
        >
          <form.Field
            name="oldPassword"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Old Password</FieldLabel>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    name={field.name}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="********"
                    aria-invalid={isInvalid}
                    className="placeholder:text-gray-500"
                    type="password"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
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
                    className="placeholder:text-gray-500"
                    type="password"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="confirmNewPassword"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    Confirm New Password
                  </FieldLabel>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    name={field.name}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="********"
                    aria-invalid={isInvalid}
                    className="placeholder:text-gray-500"
                    type="password"
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
          <Button
            type="submit"
            form="change-password-form"
            disabled={isPending}
          >
            Login
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};

export default ChangePasswordPage;
