export enum Roles {
  User = "user",
  Admin = "admin"
}

interface SuccessResponse<T> {
  success: boolean;
  message: string;
  data?:T
}

export const successResponse = <T>(message:string, data?: T): SuccessResponse<T> => ({
success : true,
message,
data
})