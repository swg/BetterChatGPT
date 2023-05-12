import React from 'react';

import DownChevronArrow from '@icon/DownChevronArrow';

import BaseButton from './BaseButton';

const LeftButton = ({
  onClick,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <BaseButton
      icon={<DownChevronArrow className='rotate-90 m-1' />}
      onClick={onClick}
    />
  );
};

export default LeftButton;
