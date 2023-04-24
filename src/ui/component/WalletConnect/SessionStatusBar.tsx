import React from 'react';
import { SessionSignal } from './SessionSignal';
import clsx from 'clsx';
import { useStatus } from './useStatus';

interface Props {
  address: string;
  brandName: string;
  className?: string;
}

export const SessionStatusBar: React.FC<Props> = ({
  address,
  brandName,
  className,
}) => {
  const status = useStatus({
    address,
    brandName,
  });

  const handleConnect = () => {
    // todo
    if (status === 'CONNECTED') {
      // disconnect
    } else if (!status || status === 'DISCONNECTED') {
      // connect
    }
  };

  return (
    <div
      className={clsx(
        'py-[6px] px-[8px] rounded-[4px]',
        'flex flex-row items-center justify-between',
        'text-[13px]',
        className
      )}
    >
      <div className="flex flex-row items-start">
        <SessionSignal
          size="small"
          address={address}
          brandName={brandName}
          className="mt-[7px]"
        />
        <div className={clsx('ml-[4px]')}>
          {status === 'CONNECTED' && <div>Connected {brandName}</div>}
          {status === 'DISCONNECTED' && (
            <div>Disconnected and trying to reconnect</div>
          )}
          {status === 'ACCOUNT_ERROR' && (
            <>
              <div>Connected 但是无法直接签名.</div>
              <div>
                The wallet address does not match ,你可以在手机钱包手动切换
              </div>
            </>
          )}
          {status === 'CHAIN_ERROR' && (
            <>
              <div>Connected 但是无法直接签名.</div>
              <div>
                The wallet chain does not match ,你可以在手机钱包手动切换
              </div>
            </>
          )}
          {!status && <div>Not Connected {brandName}</div>}
        </div>
      </div>
      <div onClick={handleConnect} className={clsx('underline cursor-pointer')}>
        {status === 'CONNECTED' && 'Disconnect'}
        {(status === 'DISCONNECTED' || !status) && 'Connect'}
      </div>
    </div>
  );
};
