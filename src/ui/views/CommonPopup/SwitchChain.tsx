import { WALLET_BRAND_CONTENT } from '@/constant';
import { useCommonPopupView } from '@/ui/utils';
import React from 'react';

export const SwitchChain: React.FC = () => {
  const { setTitle, account } = useCommonPopupView();

  React.useEffect(() => {
    setTitle('How to switch');
  }, []);

  const url = React.useMemo(() => {
    if (account?.brandName === WALLET_BRAND_CONTENT.MetaMask.name) {
      return '/images/wallet/switch-chain-metamask.png';
    }
    return '/images/wallet/switch-chain-common.png';
  }, [account?.brandName]);

  return (
    <div className="p-[10px]">
      <img src={url} className="w-full" />
    </div>
  );
};
