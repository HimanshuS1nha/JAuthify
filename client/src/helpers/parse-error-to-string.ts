import { AxiosError } from "axios";
import { ZodError } from "zod";

export const parseErrorToString = (error: Error): string => {
  if (error instanceof ZodError) {
    return error.issues[0].message;
  } else if (error instanceof AxiosError && error.response?.data.message) {
    return error.response.data.message;
  } else {
    return "Some error occured. Please try again later!";
  }
};
