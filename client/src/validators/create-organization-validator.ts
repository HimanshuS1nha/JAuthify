import z from "zod";

export const createOrganizationValidator = z.object({
  organizationName: z
    .string("Organization name is required")
    .trim()
    .min(1, "Organization name is required"),
});

export type createOrganizationValidatorType = z.infer<
  typeof createOrganizationValidator
>;
