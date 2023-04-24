import { EVENTS } from '@/constant';
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
  } = useWalletConnectPopupView();
  const [qrcodeContent, setQRcodeContent] = React.useState('');
  const [result, setResult] = React.useState('');
  const [currentAccount, setCurrentAccount] = React.useState<Account | null>(
    null
  );
  const [connectError, setConnectError] = React.useState<null | {
    code?: number;
    message?: string;
  }>(null);
  const [connectStatus, setConnectStatus] = React.useState(
    WALLETCONNECT_STATUS_MAP.WAITING
  );
  const [bridgeURL, setBridge] = React.useState<string>(DEFAULT_BRIDGE);

  const initWalletConnect = async () => {
    const account = (await wallet.syncGetCurrentAccount())!;
    const status = await wallet.getWalletConnectStatus(
      account.address,
      account.brandName
    );
    setConnectStatus(
      status === null ? WALLETCONNECT_STATUS_MAP.PENDING : status
    );
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
    const account = (await wallet.syncGetCurrentAccount())!;
    const bridge = await wallet.getWalletConnectBridge(
      account.address,
      account.brandName
    );
    setCurrentAccount(account);
    setBridge(bridge || DEFAULT_BRIDGE);
    setPopupViewTitle(`Connect with ${account.brandName}`);

    eventBus.addEventListener(
      EVENTS.WALLETCONNECT.STATUS_CHANGED,
      async ({ status, payload }) => {
        setConnectStatus(status);

        switch (status) {
          case WALLETCONNECT_STATUS_MAP.CONNECTED:
            // todo 更新当前账户的walletconnect状态
            setVisible(false);
            break;
          case WALLETCONNECT_STATUS_MAP.FAILD:
          case WALLETCONNECT_STATUS_MAP.REJECTED:
            if (payload.code) {
              setConnectError({ code: payload.code });
            } else {
              setConnectError((payload.params && payload.params[0]) || payload);
            }
            break;
          case WALLETCONNECT_STATUS_MAP.SIBMITTED:
            setResult(payload);
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
          uri={qrcodeContent}
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
