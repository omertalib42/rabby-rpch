import { Popup } from '@/ui/component';
import { useCommonPopupView } from '@/ui/utils';
import React from 'react';
import Approval from '../Approval';
import { ReconnectView } from '@/ui/component/WalletConnect/ReconnectView';
import { MetaMaskSwitchAddress } from './MetaMaskSwitchAddress';

export type CommonPopupComponentName =
  | 'Approval'
  | 'WalletConnect'
  | 'MetaMaskSwitchAddress';

export const CommonPopup: React.FC = () => {
  const {
    visible,
    setVisible,
    title,
    height,
    className,
  } = useCommonPopupView();

  return (
    <Popup
      title={<span className="text-[16px]">{title}</span>}
      closable
      height={height}
      onClose={() => setVisible(false)}
      visible={!!visible}
      className={className}
    >
      {visible === 'Approval' && <Approval className="h-full" />}
      {visible === 'WalletConnect' && <ReconnectView />}
      {visible === 'MetaMaskSwitchAddress' && <MetaMaskSwitchAddress />}
    </Popup>
  );
};
