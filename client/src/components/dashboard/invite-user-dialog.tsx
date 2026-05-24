import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import { axios } from "@/lib/axios";

import {
  inviteUserValidator,
  type inviteUserValidatorType,
} from "@/validators/invite-user-validator";

import { ToastHelper } from "@/helpers/toast-helper";
import { parseErrorToString } from "@/helpers/parse-error-to-string";

import { memberRoles } from "@/constants/member-roles";
import { apiRoutes } from "@/constants/api-routes";
import { queryKeys } from "@/constants/query-keys";

import type { Dispatch, SetStateAction } from "react";
import type { MemberRole } from "@/types";

const InviteUserDialog = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const queryClient = useQueryClient();

  const { mutate: handleInviteUser, isPending } = useMutation({
    mutationKey: ["invite-user"],
    mutationFn: async (values: inviteUserValidatorType) => {
      const { data } = await axios.post(
        apiRoutes.organization.createInvitation,
        values,
      );

      return data as { message: string };
    },
    onSuccess: async (data) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.getInvitations,
      });
      setOpen(false);
      ToastHelper.successToast(data.message);
    },
    onError: (error) => {
      ToastHelper.errorToast(parseErrorToString(error));
    },
  });

  const form = useForm({
    defaultValues: {
      inviteeEmail: "",
      role: "Member",
    },
    validators: {
      onBlur: inviteUserValidator,
      onSubmit: inviteUserValidator,
    },
    onSubmit: ({ value }) => {
      handleInviteUser({
        inviteeEmail: value.inviteeEmail,
        role: value.role as MemberRole,
      });
    },
  });
  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        form.reset();
        setOpen(false);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite User</DialogTitle>
          <DialogDescription>
            Enter the invitee&apos; email and role to invite them to your
            organization
          </DialogDescription>
        </DialogHeader>

        <form
          id="invite-user-form"
          className="flex flex-col gap-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.Field
            name="inviteeEmail"
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
            name="role"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) => {
                      if (value) {
                        field.handleChange(value);
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {memberRoles.map((role) => {
                          return <SelectItem value={role}>{role}</SelectItem>;
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
        </form>
        <DialogFooter>
          <Field orientation="horizontal">
            <Button
              type="button"
              variant="destructive"
              onClick={() => form.reset()}
              disabled={isPending}
            >
              Reset
            </Button>
            <Button type="submit" form="invite-user-form" disabled={isPending}>
              Invite
            </Button>
          </Field>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InviteUserDialog;
