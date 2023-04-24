import { EVENTS, KEYRING_CLASS } from '@/constant';
import eventBus from '@/eventBus';
import { noop, useWalletConnectPopupView, useWallet } from '@/ui/utils';
import { DEFAULT_BRIDGE } from '@rabby-wallet/eth-walletconnect-keyring';
import React from 'react';
import { Account } from 'background/service/preference';
import Scan from '@/ui/views/Approval/components/WatchAddressWaiting/Scan';
import { useStatus } from './useStatus';

export const ReconnectView: React.FC = () => {
  const wallet = useWallet();
  const {
    setTitle: setPopupViewTitle,
    setVisible,
    account,
  } = useWalletConnectPopupView();
  const [qrCodeContent, setQRcodeContent] = React.useState('');
  const [currentAccount, setCurrentAccount] = React.useState<Account | null>(
    null
  );
  const status = useStatus(account);
  const [bridgeURL, setBridge] = React.useState<string>(DEFAULT_BRIDGE);

  const initWalletConnect = async () => {
    eventBus.addEventListener(EVENTS.WALLETCONNECT.INITED, ({ uri }) => {
      setQRcodeContent(uri);
    });

    eventBus.emit(EVENTS.broadcastToBackground, {
      method: EVENTS.WALLETCONNECT.INIT,
      data: account,
    });
  };

  const handleRefreshQrCode = () => {
    initWalletConnect();
  };

  const init = async () => {
    if (!account) return;
    const bridge = await wallet.getWalletConnectBridge(
      account.address,
      account.brandName
    );
    setCurrentAccount({
      ...account,
      brandName: account.realBrandName || account.brandName,
      type: KEYRING_CLASS.WALLETCONNECT,
    });
    setBridge(bridge || DEFAULT_BRIDGE);
    setPopupViewTitle(
      `Connect with ${account.realBrandName || account.brandName}`
    );
    initWalletConnect();
  };

  React.useEffect(() => {
    init();
  }, []);

  React.useEffect(() => {
    if (status === 'CONNECTED') {
      setVisible(false);
    }
  }, [account, status]);

  return (
    <div className="watchaddress">
      {currentAccount && (
        <Scan
          uri={qrCodeContent}
          bridgeURL={bridgeURL}
          onRefresh={handleRefreshQrCode}
          defaultBridge={DEFAULT_BRIDGE}
          account={currentAccount}
          onBridgeChange={noop}
        />
      )}
    </div>
  );
};
