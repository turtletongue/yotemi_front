const ReviewCardSkeleton = () => {
  return (
    <article className="bg-card rounded-3xl flex w-full md:w-[40rem] 2xl:w-96 p-5 mt-5 gap-4 animate-pulse">
      <div className="h-10 w-10 bg-gray-400 rounded-full" />
      <div className="grow">
        <div className="flex w-full justify-between">
          <div className="h-3 w-32 rounded-full bg-gray-400" />
          <div className="h-2.5 w-24 rounded-full bg-gray-400" />
        </div>
        <div className="mt-2 bg-gray-400 w-24 h-2.5 rounded-full" />
        <div className="mt-4 bg-gray-400 w-full h-16 rounded-md" />
      </div>
    </article>
  );
};

export default ReviewCardSkeleton;
