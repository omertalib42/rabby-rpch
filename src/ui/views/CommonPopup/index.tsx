import { Popup } from '@/ui/component';
import { useCommonPopupView } from '@/ui/utils';
import React from 'react';
import Approval from '../Approval';
import { ReconnectView } from '@/ui/component/WalletConnect/ReconnectView';
import { SwitchAddress } from './SwitchAddress';
import { SwitchChain } from './SwitchChain';

export type CommonPopupComponentName =
  | 'Approval'
  | 'WalletConnect'
  | 'SwitchAddress'
  | 'SwitchChain';

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
      {visible === 'SwitchAddress' && <SwitchAddress />}
      {visible === 'SwitchChain' && <SwitchChain />}
    </Popup>
  );
};
