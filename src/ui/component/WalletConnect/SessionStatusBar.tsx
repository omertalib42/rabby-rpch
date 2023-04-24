import React from 'react';
import { SessionSignal } from './SessionSignal';
import clsx from 'clsx';
import { useStatus } from './useStatus';
import { useWallet, useWalletConnectPopupView } from '@/ui/utils';
import { WALLET_BRAND_TYPES } from '@/constant';

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
  const [displayBrandName, setDisplayBrandName] = React.useState<string>();

  const handleConnect = () => {
    if (status === 'CONNECTED') {
      wallet.killWalletConnectConnector(address, brandName);
    } else if (!status || status === 'DISCONNECTED') {
      setAccount({
        address,
        brandName,
        realBrandName: displayBrandName,
      });
      setVisible(true);
    }
  };

  React.useEffect(() => {
    if (brandName !== WALLET_BRAND_TYPES.WALLETCONNECT) {
      setDisplayBrandName(brandName);
      return;
    }
    wallet.getCommonWalletConnectInfo(address).then((result) => {
      if (!result) return;
      setDisplayBrandName(result.realBrandName || result.brandName);
    });
  }, [address, brandName]);

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
          {status === 'CONNECTED' && <div>Connected {displayBrandName}</div>}
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
          {!status && <div>Not Connected {displayBrandName}</div>}
        </div>
      </div>
      <div onClick={handleConnect} className={clsx('underline cursor-pointer')}>
        {status === 'CONNECTED' && 'Disconnect'}
        {(status === 'DISCONNECTED' || !status) && 'Connect'}
      </div>
    </div>
  );
};
