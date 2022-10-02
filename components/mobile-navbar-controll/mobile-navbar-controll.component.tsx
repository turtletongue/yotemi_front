import { useState } from 'react';

import { emptyOr, addClassUtility } from '@utils';

interface MobileNavbarControllProps {
  isNavbarOpened: boolean;
  toggleNavbar: () => unknown;
}

const MobileNavbarControll = ({
  isNavbarOpened,
  toggleNavbar,
}: MobileNavbarControllProps) => {
  const [isUsed, setIsUsed] = useState(false);

  const onClick = () => {
    toggleNavbar();

    if (!isUsed) {
      setIsUsed(true);
    }
  };

  return (
    <div
      className="cursor-pointer w-8 h-5 flex flex-col justify-between"
      onClick={onClick}
    >
      <div
        className={`${baseBarClasses} ${
          emptyOr(isNavbarOpened && 'animate-top-bar-to-cross') ||
          emptyOr(isUsed && 'animate-top-bar-from-cross')
        }`}
      />
      <div
        className={`${baseBarClasses} ${
          emptyOr(isNavbarOpened && 'animate-middle-bar-to-cross') ||
          emptyOr(isUsed && 'animate-middle-bar-from-cross')
        }`}
      />
      <div
        className={`${baseBarClasses} ${
          emptyOr(isNavbarOpened && 'animate-bottom-bar-to-cross') ||
          emptyOr(isUsed && 'animate-bottom-bar-from-cross')
        }`}
      />
    </div>
  );
};

const baseBarClasses = 'bg-white h-0.5 w-full relative';

export default MobileNavbarControll;
