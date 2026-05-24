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
  emailValidator,
  type emailValidatorType,
} from "@/validators/email-validator";

import { apiRoutes } from "@/constants/api-routes";
import { routes } from "@/constants/routes";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const { mutate: handleForgotPassword, isPending } = useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: async (values: emailValidatorType) => {
      const { data } = await axios.post(apiRoutes.auth.forgotPassword, values);

      return data as { message: string };
    },
    onSuccess: (data, values) => {
      ToastHelper.successToast(data.message);
      navigate(routes.auth.verifyOtp(values.email), { replace: true });
    },
    onError: (error) => {
      ToastHelper.errorToast(parseErrorToString(error));
    },
  });
  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: { onBlur: emailValidator, onSubmit: emailValidator },
    onSubmit: ({ value }) => {
      handleForgotPassword(value);
    },
  });
  return (
    <Card className="w-[50%]">
      <CardHeader>
        <CardTitle className="font-semibold">Forgot Password</CardTitle>
        <CardDescription>Enter your email to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="forgot-password-form"
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
                    placeholder="john.doe@example.com"
                    aria-invalid={isInvalid}
                    className="placeholder:text-gray-500"
                    type="email"
                    readOnly
                    contentEditable={false}
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
            form="forgot-password-form"
            disabled={isPending}
          >
            Verify
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};

export default ForgotPasswordPage;
