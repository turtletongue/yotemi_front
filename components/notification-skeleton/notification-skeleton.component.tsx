const NotificationSkeleton = () => {
  return (
    <div className="flex w-full justify-center items-center py-5 animate-pulse">
      <div className="mx-3 h-10 w-10 rounded-full bg-gray-400" />
      <div className="h-2.5 w-24 bg-gray-400" />
    </div>
  );
};

export default NotificationSkeleton;
