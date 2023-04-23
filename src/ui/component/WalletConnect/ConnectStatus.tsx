import React from 'react';
import clsx from 'clsx';

import TipInfoSVG from 'ui/assets/walletconnect/tip-info.svg';
import TipWarningSVG from 'ui/assets/walletconnect/tip-warning.svg';
import TipSuccessSVG from 'ui/assets/walletconnect/tip-success.svg';
import { useStatus } from './useStatus';

interface Props {
  brandName?: string;
  uri: string;
}
export const ConnectStatus: React.FC<Props> = ({ brandName }) => {
  const status = useStatus();

  const statusText = React.useMemo(() => {
    switch (status) {
      case 'RECEIVED':
        return '扫码成功，等待确认';
      case 'DISCONNECTED':
        return '已取消，可以重新扫码连接';
      case 'BRAND_NAME_ERROR':
        return `钱包不匹配，请使用 ${brandName} 扫描连接`;
      case 'CONNECTED':
        return '已连接';
      default:
        return `Scan with your ${brandName} Wallet App`;
    }
  }, [status, brandName]);

  const type = React.useMemo(() => {
    switch (status) {
      case 'RECEIVED':
      case 'CONNECTED':
        return 'success';
      case 'BRAND_NAME_ERROR':
        return 'warning';
      case 'DISCONNECTED':
        return 'info';
      default:
        return '';
    }
  }, [status]);

  const Icon = React.useMemo(() => {
    switch (type) {
      case 'success':
        return TipSuccessSVG;
      case 'warning':
        return TipWarningSVG;
      case 'info':
        return TipInfoSVG;
      default:
        return null;
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
