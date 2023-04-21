import { MemberCardSkeleton } from "@components";

const MembersGridSkeleton = () => {
  return (
    <article className="w-full h-full grow grid gap-4 justify-items-center grid-flow-row-dense grid-cols-cards">
      {new Array(10).fill(null).map((_, index) => (
        <MemberCardSkeleton key={index} />
      ))}
    </article>
  );
};

export default MembersGridSkeleton;
