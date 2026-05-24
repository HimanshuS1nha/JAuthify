import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { REGEXP_ONLY_DIGITS } from "input-otp";

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";

import { axios } from "@/lib/axios";

import { ToastHelper } from "@/helpers/toast-helper";
import { parseErrorToString } from "@/helpers/parse-error-to-string";

import {
  verifyEmailValidator,
  type verifyEmailValidatorType,
} from "@/validators/verify-email-validator";

import { apiRoutes } from "@/constants/api-routes";
import { routes } from "@/constants/routes";

const VerifyEmailPage = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const { mutate: handleVerifyEmail, isPending } = useMutation({
    mutationKey: ["verify-otp"],
    mutationFn: async (values: verifyEmailValidatorType) => {
      const { data } = await axios.post(apiRoutes.auth.verifyEmail, {
        ...values,
        email,
      });

      return data as { message: string };
    },
    onSuccess: (data) => {
      ToastHelper.successToast(data.message);
      navigate(routes.auth.login(), { replace: true });
    },
    onError: (error) => {
      ToastHelper.errorToast(parseErrorToString(error));
    },
  });

  const { mutate: handleResendOTP, isPending: resendOtpPending } = useMutation({
    mutationKey: ["resend-otp"],
    mutationFn: async () => {
      const { data } = await axios.post(apiRoutes.auth.resendOtp, {
        purpose: "VerifyEmail",
      });

      return data as { message: string };
    },
    onSuccess: (data) => {
      ToastHelper.successToast(data.message);
    },
    onError: (error) => {
      ToastHelper.errorToast(parseErrorToString(error));
    },
  });

  const form = useForm({
    defaultValues: {
      otp: "",
    },
    validators: {
      onBlur: verifyEmailValidator,
      onSubmit: verifyEmailValidator,
    },
    onSubmit: ({ value }) => {
      handleVerifyEmail(value);
    },
  });
  return (
    <Card className="w-[50%]">
      <CardHeader>
        <CardTitle className="font-semibold">Verify Email</CardTitle>
        <CardDescription>Verify your email to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="verify-email-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex flex-col gap-y-5"
        >
          <form.Field
            name="otp"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>OTP</FieldLabel>
                  <InputOTP
                    maxLength={6}
                    value={field.state.value}
                    onChange={field.handleChange}
                    onBlur={field.handleBlur}
                    pattern={REGEXP_ONLY_DIGITS}
                    name={field.name}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}

                  <div className="flex justify-end">
                    <Button
                      variant={"link"}
                      type="button"
                      onClick={() => handleResendOTP()}
                      disabled={isPending || resendOtpPending}
                    >
                      Resend OTP
                    </Button>
                  </div>
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
          <Button type="submit" form="verify-email-form" disabled={isPending}>
            Verify
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};

export default VerifyEmailPage;
