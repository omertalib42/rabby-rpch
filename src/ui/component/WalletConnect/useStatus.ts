import { EVENTS } from '@/constant';
import eventBus from '@/eventBus';
import { isSameAddress, useWallet } from '@/ui/utils';
import { WALLETCONNECT_SESSION_STATUS_MAP } from '@rabby-wallet/eth-walletconnect-keyring';
import React from 'react';

/**
 * WalletConnect connect status
 * if account is not provided, it will return the status no matter which account is connected
 * if account is provided, it will return the status of the provided account
 */
export const useStatus = (account?: { address: string; brandName: string }) => {
  const wallet = useWallet();
  const [status, setStatus] = React.useState<
    keyof typeof WALLETCONNECT_SESSION_STATUS_MAP
  >();

  React.useEffect(() => {
    const handleSessionChange = (data: any) => {
      console.log(data);
      if (
        !account ||
        !data.address ||
        (isSameAddress(data.address, account.address) &&
          data.brandName === account.brandName)
      ) {
        setStatus(data.status);
      } else if (data.brandName !== account.brandName) {
        setStatus('BRAND_NAME_ERROR');
      } else if (!isSameAddress(data.address, account.address)) {
        setStatus('ACCOUNT_ERROR');
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
  }, [account]);

  React.useEffect(() => {
    if (account) {
      wallet
        .getWalletConnectSessionStatus(account.address, account.brandName)
        .then((result) => result && setStatus(result));
    }
  }, [account]);

  return status;
};
