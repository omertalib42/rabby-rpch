import React from 'react';
import { useStatus } from './useStatus';
import clsx from 'clsx';

interface Props {
  size?: 'small' | 'normal';
  isBadge?: boolean;
  address: string;
  brandName: string;
}

export const SessionSignal: React.FC<Props> = ({
  size = 'normal',
  isBadge,
  address,
  brandName,
}) => {
  const status = useStatus({
    address,
    brandName,
  });

  return (
    <div
      className={clsx(
        'rounded-full',
        {
          'w-[6px] h-[6px]': size === 'small',
          'w-[8px] h-[8px]': size === 'normal',
          'right-[-2px] bottom-[-2px] absolute': isBadge,
        },
        'border border-white',
        {
          'bg-green': status === 'CONNECTED',
          'bg-red-forbidden': status === 'DISCONNECTED',
          'bg-orange': status === 'ACCOUNT_ERROR' || status === 'CHAIN_ERROR',
          'bg-gray-comment': !status,
        }
      )}
    />
  );
};
