import { WALLET_BRAND_TYPES } from '@/constant';
import { useCommonPopupView } from '@/ui/utils';
import React from 'react';

export const SwitchAddress: React.FC = () => {
  const { setTitle, account } = useCommonPopupView();

  React.useEffect(() => {
    setTitle('How to switch');
  }, []);

  const url = React.useMemo(() => {
    if (account?.brandName === WALLET_BRAND_TYPES.METAMASK) {
      return '/images/wallet/switch-address-metamask.png';
    }
    return '/images/wallet/switch-address-common.png';
  }, [account?.brandName]);

  return (
    <div className="p-[10px]">
      <img src={url} className="w-full" />
    </div>
  );
};
