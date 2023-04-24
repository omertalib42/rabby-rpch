import { Popup } from '@/ui/component';
import { useWalletConnectPopupView } from '@/ui/utils';
import React from 'react';
import { ReconnectView } from '@/ui/component/WalletConnect/ReconnectView';

// for connect WalletConnect
export const WalletConnectPopup: React.FC = () => {
  const { visible, setVisible, title } = useWalletConnectPopupView();

  return (
    <Popup
      title={<span className="text-[16px]">{title}</span>}
      closable
      height={420}
      onClose={() => setVisible(false)}
      visible={visible}
    >
      {visible && <ReconnectView />}
    </Popup>
  );
};
