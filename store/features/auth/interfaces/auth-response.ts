import { User } from "@store/features/users";

export default interface AuthResponse {
  accessToken: string;
  user: User;
}
