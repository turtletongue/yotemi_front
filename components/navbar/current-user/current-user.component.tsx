import Link from "next/link";

import { Avatar } from "@components";

const CurrentUser = () => {
  const user = {
    name: "Alice",
    avatarUrl: "https://avatars.dicebear.com/api/croodles-neutral/alice.svg",
  };

  return (
    <Link href="/profile" className="flex items-center cursor-pointer">
      <span className="font-roboto sm:text-white mr-2">{user.name}</span>
      <Avatar imageUrl={user.avatarUrl} alt={`${user.name} avatar`} />
    </Link>
  );
};

export default CurrentUser;
