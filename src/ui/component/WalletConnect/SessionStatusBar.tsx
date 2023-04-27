import React from 'react';
import { SessionSignal } from './SessionSignal';
import clsx from 'clsx';
import { useStatus } from './useStatus';
import { useWallet, useCommonPopupView } from '@/ui/utils';
import { useDisplayBrandName } from './useDisplayBrandName';

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
  const { setVisible, setAccount } = useCommonPopupView();
  const wallet = useWallet();
  const [displayBrandName, realBrandName] = useDisplayBrandName(
    brandName,
    address
  );

  const tipStatus = React.useMemo(() => {
    switch (status) {
      case 'ACCOUNT_ERROR':
        return 'ACCOUNT_ERROR';
      case 'CHAIN_ERROR':
        return 'CHAIN_ERROR';
      case undefined:
      case 'DISCONNECTED':
      case 'RECEIVED':
      case 'REJECTED':
      case 'BRAND_NAME_ERROR':
        return 'DISCONNECTED';

      default:
        return 'CONNECTED';
    }
  }, [status]);

  const handleButton = () => {
    setAccount({
      address,
      brandName,
      realBrandName,
    });
    if (tipStatus === 'CONNECTED') {
      wallet.killWalletConnectConnector(address, brandName, true);
    } else if (tipStatus === 'DISCONNECTED') {
      setVisible('WalletConnect');
    } else if (tipStatus === 'ACCOUNT_ERROR') {
      setVisible('SwitchAddress');
    } else if (tipStatus === 'CHAIN_ERROR') {
      setVisible('SwitchChain');
    }
  };

  const TipContent = () => {
    switch (tipStatus) {
      case 'ACCOUNT_ERROR':
        return (
          <>
            <div>Connected but unable to sign.</div>
            <div>Please switch to the correct address in mobile wallet</div>
          </>
        );

      case 'DISCONNECTED':
        return <div>Not Connected to {displayBrandName}</div>;

      default:
        return <div>Connected to {displayBrandName}</div>;
    }
  };

  return (
    <div
      className={clsx(
        'relative',
        'py-[6px] pl-[8px] pr-[6px] rounded-[4px]',
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
          <TipContent />
        </div>
      </div>
      <div
        onClick={handleButton}
        className={clsx(
          'underline cursor-pointer',
          'absolute right-[8px] top-[6px]'
        )}
      >
        {tipStatus === 'CONNECTED' && 'Disconnect'}
        {tipStatus === 'DISCONNECTED' && 'Connect'}
        {tipStatus === 'ACCOUNT_ERROR' && 'How to switch'}
      </div>
    </div>
  );
};
