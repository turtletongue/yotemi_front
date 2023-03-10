import { User } from "@redux/features/users";

export interface AuthState {
  accessToken: string | null;
  user: User | null;
}

const authInitialState: AuthState = {
  accessToken: null,
  user: null,
};

export default authInitialState;
