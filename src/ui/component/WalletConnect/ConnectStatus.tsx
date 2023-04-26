import React from 'react';
import clsx from 'clsx';

import TipInfoSVG from 'ui/assets/walletconnect/tip-info.svg';
import TipWarningSVG from 'ui/assets/walletconnect/tip-warning.svg';
import TipSuccessSVG from 'ui/assets/walletconnect/tip-success.svg';
import { useStatus } from './useStatus';
import { Account } from '@/background/service/preference';
import { useDisplayBrandName } from './useDisplayBrandName';

interface Props {
  brandName?: string;
  account?: Account;
  uri: string;
}
export const ConnectStatus: React.FC<Props> = ({ brandName, account }) => {
  const status = useStatus(account);
  const displayBrandName = useDisplayBrandName(brandName);

  const statusText = React.useMemo(() => {
    switch (status) {
      case 'RECEIVED':
        return 'Scan successful. Waiting to be confirmed';
      case 'REJECTED':
      case 'DISCONNECTED':
        return 'Connection canceled. Please scan the QR code to retry.';
      case 'BRAND_NAME_ERROR':
        return `Wrong wallet app. Please use ${displayBrandName} to connect`;
      case 'ACCOUNT_ERROR':
        return 'Address not match. Please switch address in your mobile wallet';
      case 'CONNECTED':
        return 'Connected';
      default:
        return `Scan with your ${displayBrandName} wallet`;
    }
  }, [status, displayBrandName]);

  const type = React.useMemo(() => {
    switch (status) {
      case 'RECEIVED':
      case 'CONNECTED':
        return 'success';
      case 'BRAND_NAME_ERROR':
        return 'warning';
      case 'REJECTED':
      case 'DISCONNECTED':
      default:
        return 'info';
    }
  }, [status]);

  const Icon = React.useMemo(() => {
    switch (type) {
      case 'success':
        return TipSuccessSVG;
      case 'warning':
        return TipWarningSVG;
      case 'info':
      default:
        return TipInfoSVG;
    }
  }, [type]);

  return (
    <div
      className={clsx(
        'session-status',
        'py-[15px] px-[30px] rounded-[4px] mt-[40px] m-auto',
        'w-[360px] text-center leading-none',
        {
          'bg-[#E5E9EF] text-[#4B4D59] font-medium': !type || type === 'info',
          'bg-[#27C1930D] text-[#27C193]': type === 'success',
          'bg-[#FFB0200D] text-[#FFB020]': type === 'warning',
        }
      )}
    >
      {Icon && (
        <img src={Icon} className="inline-block mr-[6px] w-[14px] h-[14px]" />
      )}
      {statusText}
    </div>
  );
};
