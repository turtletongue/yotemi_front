import { Topic } from "@redux/features/topics";

export interface MemberFiltersState {
  topics: Topic[];
  search: string;
  orderBy: "rating" | "activity";
}

const memberFiltersInitialState: MemberFiltersState = {
  topics: [],
  search: "",
  orderBy: "rating",
};

export default memberFiltersInitialState;
