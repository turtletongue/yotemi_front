import { MemberCardSkeleton } from "@components";

const MembersGridSkeleton = () => {
  return (
    <article className="w-full h-full grid gap-4 content-between justify-items-center grid-flow-row-dense md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {new Array(10).fill(null).map((_, index) => (
        <MemberCardSkeleton key={index} />
      ))}
    </article>
  );
};

export default MembersGridSkeleton;
