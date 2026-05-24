import { useEffect, useState } from "react";
import { UsersIcon, SendIcon, CookieIcon, PlusIcon } from "lucide-react";
import { useQueries, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import MembersTable from "@/components/dashboard/members-table";
import InvitationsTable from "@/components/dashboard/invitations-table";
import Loading from "@/components/shared/loading";
import SessionsTable from "@/components/dashboard/sessions-table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import CreateOrganizationDialog from "@/components/dashboard/create-organization-dialog";

import { cn } from "@/lib/utils";
import { axios } from "@/lib/axios";

import { ToastHelper } from "@/helpers/toast-helper";
import { parseErrorToString } from "@/helpers/parse-error-to-string";

import { apiRoutes } from "@/constants/api-routes";
import { queryKeys } from "@/constants/query-keys";
import { routes } from "@/constants/routes";

import {
  type MemberType,
  type InvitationType,
  type SessionType,
  type OrganizationType,
} from "@/types";
import OrganizationsTable from "@/components/dashboard/organizations-table";
import { useUserRole } from "@/hooks/use-user-role";

type ActiveTab = "members" | "invitations" | "sessions" | "organizations";

const tabs: { id: ActiveTab; label: string }[] = [
  { id: "members", label: "Members" },
  { id: "invitations", label: "Invitations" },
  { id: "sessions", label: "Sessions" },
  { id: "organizations", label: "Organizations" },
];

const DashboardPage = () => {
  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<ActiveTab>("members");
  const [isCreateOrganizationDialogOpen, setIsCreateOrganizationDialogOpen] =
    useState(false);

  const { role } = useUserRole();

  const [
    { data: members, isPending: membersPending, error: membersError },
    {
      data: invitations,
      isPending: invitationsPending,
      error: invitationsError,
    },
    { data: sessions, isPending: sessionsPending, error: sessionsError },
    {
      data: activeOrganization,
      isPending: activeOrganizationPending,
      error: activeOrganizationError,
    },
    {
      data: organizations,
      isPending: organizationsPending,
      error: organizationsError,
    },
  ] = useQueries({
    queries: [
      {
        queryKey: queryKeys.getMembers,
        queryFn: async () => {
          const { data } = await axios.get(apiRoutes.organization.members);

          return data as MemberType[];
        },
      },
      {
        queryKey: queryKeys.getInvitations,
        queryFn: async () => {
          const { data } = await axios.get(
            apiRoutes.organization.getInvitations,
          );

          return data as InvitationType[];
        },
      },
      {
        queryKey: queryKeys.getSessions,
        queryFn: async () => {
          const { data } = await axios.get(apiRoutes.auth.sessions);

          return data as SessionType[];
        },
      },
      {
        queryKey: queryKeys.getActiveOrganization,
        queryFn: async () => {
          const { data } = await axios.get(apiRoutes.organization.getActive);

          return data as OrganizationType;
        },
      },
      {
        queryKey: queryKeys.getOrganizations,
        queryFn: async () => {
          const { data } = await axios.get(apiRoutes.organization.getAll);

          return data as OrganizationType[];
        },
      },
    ],
  });

  const {
    mutate: handleSwitchOrganization,
    isPending: switchOrganizationPending,
  } = useMutation({
    mutationKey: ["switch-organization"],
    mutationFn: async (organizationId: string) => {
      const { data } = await axios.get(
        apiRoutes.organization.switch(organizationId),
      );

      return data as { message: string };
    },
    onSuccess: async (data) => {
      // Invalidate everything
      await queryClient.invalidateQueries();

      ToastHelper.successToast(data.message);
    },
    onError: (error) => {
      ToastHelper.errorToast(parseErrorToString(error));
    },
  });

  useEffect(() => {
    if (
      membersError ||
      invitationsError ||
      sessionsError ||
      activeOrganizationError ||
      organizationsError
    ) {
      ToastHelper.errorToast(
        parseErrorToString(
          membersError ??
            invitationsError ??
            sessionsError ??
            activeOrganizationError ??
            organizationsError ??
            new Error("Some error occured"),
        ),
      );
    }
  }, [
    membersError,
    invitationsError,
    sessionsError,
    activeOrganizationError,
    organizationsError,
  ]);

  const isPending = membersPending || invitationsPending || sessionsPending;

  const stats = [
    {
      label: "Total Members",
      value: members?.length ?? 0,
      icon: UsersIcon,
      accent: "primary" as const,
    },
    {
      label: "Total Invitations",
      value: invitations?.length ?? 0,
      icon: SendIcon,
      accent: "emerald" as const,
    },
    {
      label: "Total Sessions",
      value: sessions?.length ?? 0,
      icon: CookieIcon,
      accent: "default" as const,
    },
  ];
  return (
    <>
      {organizationsPending ? (
        <Loading />
      ) : organizations && organizations.length > 0 ? (
        <div className="py-10 space-y-8">
          <CreateOrganizationDialog
            open={isCreateOrganizationDialogOpen}
            setOpen={setIsCreateOrganizationDialogOpen}
          />

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-secondary">
              Team Dashboard
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your organization's members and track pending invitations.
            </p>
          </div>

          {activeOrganizationPending || organizationsPending ? (
            <Loading />
          ) : (
            activeOrganization && (
              <div className="flex gap-x-2 items-center relative">
                <Select
                  value={activeOrganization.name}
                  onValueChange={(value) => {
                    if (value) {
                      handleSwitchOrganization(value);
                    }
                  }}
                  disabled={switchOrganizationPending}
                >
                  <SelectTrigger
                    className={"bg-white w-full border border-gray-300"}
                  >
                    <SelectValue placeholder="Select an organization" />
                  </SelectTrigger>
                  <SelectContent className={"bg-white"}>
                    <SelectGroup>
                      {organizations?.map((org) => {
                        return (
                          <SelectItem value={org.id}>{org.name}</SelectItem>
                        );
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Button
                  onClick={() => setIsCreateOrganizationDialogOpen(true)}
                  disabled={switchOrganizationPending}
                >
                  <PlusIcon />
                </Button>

                {switchOrganizationPending && (
                  <div className="absolute w-full h-full flex justify-center items-center">
                    <Loading />
                  </div>
                )}
              </div>
            )
          )}

          <DashboardStats stats={stats} />

          <Separator />

          <Card className="gap-0 py-0 overflow-visible">
            <div className="flex items-center gap-1 border-b px-4 pt-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "relative px-4 pb-3 text-sm font-medium transition-colors",
                    "focus-visible:outline-none",
                    activeTab === tab.id
                      ? "text-foreground after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:rounded-full after:bg-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <CardContent className="p-6">
              {isPending ? (
                <Loading />
              ) : activeTab === "members" ? (
                <MembersTable members={members ?? []} role={role} />
              ) : activeTab === "invitations" ? (
                <InvitationsTable invitations={invitations ?? []} />
              ) : activeTab === "sessions" ? (
                <SessionsTable sessions={sessions ?? []} />
              ) : (
                <OrganizationsTable
                  organizations={organizations ?? []}
                  activeOrganizationId={activeOrganization?.id}
                  role={role}
                />
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        // No org state
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center">
          <h2 className="text-xl font-semibold text-secondary">
            No organization found
          </h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            Please create an organization before proceeding to the dashboard.
          </p>
          <Button onClick={() => navigate(routes.auth.createOrganization)}>
            Create Organization
          </Button>
        </div>
      )}
    </>
  );
};

export default DashboardPage;
