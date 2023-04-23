import { EVENTS } from '@/constant';
import eventBus from '@/eventBus';
import { useWallet } from '@/ui/utils';
import { WALLETCONNECT_SESSION_STATUS_MAP } from '@rabby-wallet/eth-walletconnect-keyring';
import React from 'react';

export const useStatus = (opt?: { address: string; brandName: string }) => {
  const wallet = useWallet();
  const [status, setStatus] = React.useState<
    keyof typeof WALLETCONNECT_SESSION_STATUS_MAP
  >();

  React.useEffect(() => {
    const handleSessionChange = (data: any) => {
      console.log(data);
      if (!opt) {
        setStatus(data.status);
      } else if (
        data.address === opt.address &&
        data.brandName === opt.brandName
      ) {
        setStatus(data.status);
      }
    };

    eventBus.addEventListener(
      EVENTS.WALLETCONNECT.SESSION_STATUS_CHANGED,
      handleSessionChange
    );

    return () => {
      eventBus.removeEventListener(
        EVENTS.WALLETCONNECT.SESSION_STATUS_CHANGED,
        handleSessionChange
      );
    };
  }, [opt]);

  React.useEffect(() => {
    if (opt) {
      wallet
        .getWalletConnectSessionStatus(opt.address, opt.brandName)
        .then((result) => result && setStatus(result));
    }
  }, [opt]);

  return status;
};
