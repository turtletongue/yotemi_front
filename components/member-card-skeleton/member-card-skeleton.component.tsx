const MemberCardSkeleton = () => {
  return (
    <article className="bg-card shadow-md w-[21rem] pb-4 rounded-3xl overflow-hidden animate-pulse">
      <div className="h-[5rem] mx-auto bg-gray-400"></div>
      <div className="px-4 mt-3">
        <div className="flex w-full justify-between items-center">
          <div className="flex gap-4">
            <div className="h-10 w-10 bg-gray-400 rounded-full" />
            <div className="mt-2">
              <div className="h-3 w-32 rounded-full bg-gray-400" />
              <div className="h-2.5 w-24 mt-2 rounded-full bg-gray-400" />
            </div>
          </div>
          <div className="h-10 w-24 bg-gray-400 rounded-full" />
        </div>
        <div className="mt-4">
          <div className="mt-3 h-2.5 w-full rounded-full bg-gray-400" />
          <div className="mt-3 h-2.5 w-full rounded-full bg-gray-400" />
          <div className="mt-3 h-2.5 w-full rounded-full bg-gray-400" />
          <div className="mt-3 h-2.5 w-24 rounded-full bg-gray-400" />
        </div>
        <div className="flex gap-2 flex-wrap w-full mt-4">
          <div className="h-6 w-20 rounded-full bg-gray-400" />
        </div>
      </div>
    </article>
  );
};

export default MemberCardSkeleton;
