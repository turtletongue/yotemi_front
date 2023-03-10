import { User } from "@redux/features/users";

export default interface AuthResponse {
  accessToken: string;
  user: User;
}
