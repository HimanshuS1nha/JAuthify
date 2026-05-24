import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Loading from "@/components/shared/loading";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";

import { axios } from "@/lib/axios";

import { useUser } from "@/hooks/use-user";

import { ToastHelper } from "@/helpers/toast-helper";
import { parseErrorToString } from "@/helpers/parse-error-to-string";

import { routes } from "@/constants/routes";
import { apiRoutes } from "@/constants/api-routes";
import { queryKeys } from "@/constants/query-keys";

const InvitationPage = () => {
  const { invitationId } = useParams() as { invitationId: string };

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const { user, isPending: getUserPending } = useUser();

  const { data: invitation, isPending: getInvitationPending } = useQuery({
    queryKey: ["get-invitation"],
    queryFn: async () => {
      const { data } = await axios.get(
        apiRoutes.organization.getInvitation(invitationId),
      );

      return data as { organizationName: string; inviterName: string };
    },
  });

  const { mutate: handleAnswerInvitation, isPending: answerInvitationPending } =
    useMutation({
      mutationKey: ["answer-invite"],
      mutationFn: async (answer: "accept" | "reject") => {
        const { data } = await axios.post(
          answer === "accept"
            ? apiRoutes.organization.acceptInvitation
            : apiRoutes.organization.rejectInvitation,
          { inviteId: invitationId },
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

  if (getUserPending) {
    return <Loading />;
  }

  if (!user) {
    navigate(routes.auth.login(routes.joinOrganization(invitationId)), {
      replace: true,
    });

    return null;
  }

  return (
    <>
      {getInvitationPending ? (
        <Loading />
      ) : invitation ? (
        <Card className="w-[50%]">
          <CardHeader>
            <CardTitle className="font-semibold">Join Organization</CardTitle>
            <CardDescription>
              Click on the buttons below to accept or reject the invitation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <span className="font-semibold">{invitation.inviterName}</span>{" "}
            invited to you to join organization{" "}
            <span className="font-semibold">{invitation.organizationName}</span>
          </CardContent>

          <CardFooter>
            <Field orientation="horizontal">
              <Button
                variant="destructive"
                onClick={() => handleAnswerInvitation("reject")}
                disabled={answerInvitationPending}
              >
                Reject
              </Button>
              <Button
                onClick={() => handleAnswerInvitation("accept")}
                disabled={answerInvitationPending}
              >
                Accept
              </Button>
            </Field>
          </CardFooter>
        </Card>
      ) : (
        <p className="text-destructive">Some error occurred</p>
      )}
    </>
  );
};

export default InvitationPage;
