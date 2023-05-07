import { MemberCardSkeleton } from "@components";

const MembersGridSkeleton = () => {
  return (
    <article className="w-full h-full grow grid gap-6 justify-items-center justify-center md:justify-start grid-flow-row-dense grid-cols-cards auto-rows-cards">
      {new Array(10).fill(null).map((_, index) => (
        <MemberCardSkeleton key={index} />
      ))}
    </article>
  );
};

export default MembersGridSkeleton;
