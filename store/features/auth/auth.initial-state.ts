import { User } from "@store/features/users";

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  targetUsername: string | null;
}

const authInitialState: AuthState = {
  accessToken: null,
  user: null,
  targetUsername: null,
};

export default authInitialState;
