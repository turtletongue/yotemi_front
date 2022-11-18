import Image from "next/image";

interface INotificationProps {
  imageUrl: string;
  text: string;
  isDisabled?: boolean;
}

const Notification = ({
  imageUrl,
  text,
  isDisabled = false,
}: INotificationProps) => {
  return (
    <div
      className={`flex w-full justify-center items-center py-5 ${
        isDisabled ? "opacity-20" : "cursor-pointer hover:bg-gray-50"
      }`}
    >
      <Image
        width={50}
        height={50}
        src={imageUrl}
        alt={text}
        className="bg-white"
      />
      <div className="mx-4" />
      <p className="text-sm w-56">{text}</p>
    </div>
  );
};

export default Notification;
