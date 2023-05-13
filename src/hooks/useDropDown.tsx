import React, { ReactNode, useState, useEffect } from 'react';
import useHideOnOutsideClick from './useHideOnOutsideClick';

import DownChevronArrow from '@icon/DownChevronArrow';

const useSelector = ({
  selected,
  selections,
  onClick,
  icon = <DownChevronArrow />,
}: {
  selected: string | ReactNode | React.ReactElement;
  selections: string[];
  onClick: React.MouseEventHandler<HTMLElement>;
  icon?: React.ReactElement;
}) => {
  const [dropDown, setDropDown, dropDownRef] = useHideOnOutsideClick();
  const [openDirection, setOpenDirection] = useState('down');
  
  const checkOpenDirection = () => {
    if (!dropDownRef.current) return;
    const rect = dropDownRef.current.getBoundingClientRect();
    setOpenDirection(rect.bottom > window.innerHeight ? 'up' : 'down');
  };

  useEffect(() => {
    checkOpenDirection();
    window.addEventListener('resize', checkOpenDirection);
    return () => {
      window.removeEventListener('resize', checkOpenDirection);
    };
  }, []);

  return (
    <div className='prose dark:prose-invert relative'>
      <button
        className='btn btn-neutral btn-small flex gap-1'
        type='button'
        onClick={() => setDropDown((prev) => !prev)}
      >
        {selected}
        {icon}
      </button>
      <div
        ref={dropDownRef}
        id='dropdown'
        className={`${
          dropDown ? '' : 'hidden'
        } absolute top-100 bottom-100 z-10 bg-white rounded-lg shadow-xl border-b border-black/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100 group dark:bg-gray-800 opacity-90`}
      >
        <ul
          className='text-sm text-gray-700 dark:text-gray-200 p-0 m-0'
          aria-labelledby='dropdownDefaultButton'
        >
          {selections.map((r) => (
            <li
              className='px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer'
              onClick={(e) => {
                onClick(e);
                setDropDown(false);
              }}
              key={r}
            >
              {r}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default useSelector;
