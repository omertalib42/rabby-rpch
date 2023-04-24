import { EVENTS, KEYRING_CLASS } from '@/constant';
import eventBus from '@/eventBus';
import { noop, useWalletConnectPopupView, useWallet } from '@/ui/utils';
import {
  DEFAULT_BRIDGE,
  WALLETCONNECT_STATUS_MAP,
} from '@rabby-wallet/eth-walletconnect-keyring';
import React from 'react';
import { Account } from 'background/service/preference';
import Scan from '@/ui/views/Approval/components/WatchAddressWaiting/Scan';

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
      type: KEYRING_CLASS.WALLETCONNECT,
    });
    setBridge(bridge || DEFAULT_BRIDGE);
    setPopupViewTitle(
      `Connect with ${account.realBrandName || account.brandName}`
    );

    eventBus.addEventListener(
      EVENTS.WALLETCONNECT.STATUS_CHANGED,
      async ({ status }) => {
        switch (status) {
          case WALLETCONNECT_STATUS_MAP.CONNECTED:
            setVisible(false);
            break;
          default:
            break;
        }
      }
    );
    initWalletConnect();
  };

  React.useEffect(() => {
    init();
  }, []);

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
