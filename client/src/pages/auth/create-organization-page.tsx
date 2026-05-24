import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  createOrganizationValidator,
  type createOrganizationValidatorType,
} from "@/validators/create-organization-validator";

import { ToastHelper } from "@/helpers/toast-helper";
import { parseErrorToString } from "@/helpers/parse-error-to-string";

import { apiRoutes } from "@/constants/api-routes";
import { routes } from "@/constants/routes";
import { queryKeys } from "@/constants/query-keys";

const CreateOrganizationPage = () => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { mutate: handleCreateOrganization, isPending } = useMutation({
    mutationKey: ["create-organization"],
    mutationFn: async (values: createOrganizationValidatorType) => {
      const { data } = await axios.post(
        apiRoutes.organization.createOrganization,
        values,
      );

      return data as { message: string };
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.getUser });

      ToastHelper.successToast(data.message);

      navigate(routes.dashboard, { replace: true });
    },
    onError: (error) => {
      ToastHelper.errorToast(parseErrorToString(error));
    },
  });

  const form = useForm({
    defaultValues: {
      organizationName: "",
    },
    validators: {
      onBlur: createOrganizationValidator,
      onSubmit: createOrganizationValidator,
    },
    onSubmit: ({ value }) => {
      handleCreateOrganization(value);
    },
  });
  return (
    <Card className="w-[50%]">
      <CardHeader>
        <CardTitle className="font-semibold">Create Organization</CardTitle>
        <CardDescription>Create an organization to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="create-organization-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex flex-col gap-y-5"
        >
          <form.Field
            name="organizationName"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    Organization Name
                  </FieldLabel>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    name={field.name}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="My Organization"
                    aria-invalid={isInvalid}
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
          <Button
            type="submit"
            form="create-organization-form"
            disabled={isPending}
          >
            Create
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};

export default CreateOrganizationPage;
