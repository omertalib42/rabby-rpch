import React from 'react';
import { SessionSignal } from './SessionSignal';
import clsx from 'clsx';
import { useStatus } from './useStatus';
import { useWallet, useWalletConnectPopupView } from '@/ui/utils';
import { WALLET_BRAND_TYPES } from '@/constant';
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
  const { setVisible, setAccount } = useWalletConnectPopupView();
  const wallet = useWallet();
  const [realBrandName, setRealBrandName] = React.useState<string>();
  const displayBrandName = useDisplayBrandName(realBrandName);

  const handleConnect = () => {
    if (status === 'CONNECTED') {
      wallet.killWalletConnectConnector(address, brandName);
    } else if (!status || status === 'DISCONNECTED') {
      setAccount({
        address,
        brandName,
        realBrandName,
      });
      setVisible(true);
    }
  };

  React.useEffect(() => {
    if (brandName !== WALLET_BRAND_TYPES.WALLETCONNECT) {
      setRealBrandName(brandName);
      return;
    }
    wallet.getCommonWalletConnectInfo(address).then((result) => {
      if (!result) return;
      setRealBrandName(result.realBrandName || result.brandName);
    });
  }, [address, brandName]);

  const TipContent = () => {
    switch (status) {
      case 'ACCOUNT_ERROR':
        return (
          <>
            <div>Connected but unable to sign.</div>
            <div>Please switch to the correct address in mobile wallet</div>
          </>
        );

      case undefined:
      case 'DISCONNECTED':
        return <div>Not Connected to {displayBrandName}</div>;

      default:
        return <div>Connected to {displayBrandName}</div>;
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
          <TipContent />
        </div>
      </div>
      <div onClick={handleConnect} className={clsx('underline cursor-pointer')}>
        {status === 'CONNECTED' && 'Disconnect'}
        {(status === 'DISCONNECTED' || !status) && 'Connect'}
      </div>
    </div>
  );
};
