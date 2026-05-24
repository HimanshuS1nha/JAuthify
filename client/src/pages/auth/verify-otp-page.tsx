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
  verifyOtpValidator,
  type verifyOtpValidatorType,
} from "@/validators/verify-otp-validator";

import { apiRoutes } from "@/constants/api-routes";
import { routes } from "@/constants/routes";
import { Input } from "@/components/ui/input";

const VerifyOtpPage = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const navigate = useNavigate();

  const { mutate: handleVerifyOtp, isPending } = useMutation({
    mutationKey: ["verify-otp"],
    mutationFn: async (values: verifyOtpValidatorType) => {
      const { data } = await axios.post(
        apiRoutes.auth.verifyForgotPasswordAttempt,
        values,
      );

      return data as { message: string };
    },
    onSuccess: (data) => {
      ToastHelper.successToast(data.message);
      navigate(routes.auth.resetPassword, { replace: true });
    },
    onError: (error) => {
      ToastHelper.errorToast(parseErrorToString(error));
    },
  });

  const { mutate: handleResendOTP, isPending: resendOtpPending } = useMutation({
    mutationKey: ["resend-otp"],
    mutationFn: async () => {
      const { data } = await axios.post(apiRoutes.auth.resendOtp, {
        purpose: "ResetPassword",
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
      email: email ?? "",
    },
    validators: {
      onBlur: verifyOtpValidator,
      onSubmit: verifyOtpValidator,
    },
    onSubmit: ({ value }) => {
      if (!email) {
        ToastHelper.errorToast("Email not found");
        return;
      }

      handleVerifyOtp(value);
    },
  });
  return (
    <Card className="w-[50%]">
      <CardHeader>
        <CardTitle className="font-semibold">Verify OTP</CardTitle>
        <CardDescription>
          Enter the OTP sent to your email to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="verify-otp-form"
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
                      <InputOTPSlot index={0} className="bg-white" />
                      <InputOTPSlot index={1} className="bg-white" />
                      <InputOTPSlot index={2} className="bg-white" />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} className="bg-white" />
                      <InputOTPSlot index={4} className="bg-white" />
                      <InputOTPSlot index={5} className="bg-white" />
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
          <Button type="submit" form="verify-otp-form" disabled={isPending}>
            Verify
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};

export default VerifyOtpPage;
