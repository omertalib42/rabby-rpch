import { useCommonPopupView } from '@/ui/utils';
import React from 'react';

export const MetaMaskSwitchAddress: React.FC = () => {
  const { setTitle } = useCommonPopupView();

  React.useEffect(() => {
    setTitle('How to switch');
  }, []);

  return <div>问产品</div>;
};
