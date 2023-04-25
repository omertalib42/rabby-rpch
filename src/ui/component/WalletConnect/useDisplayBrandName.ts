import { WALLET_BRAND_CONTENT, WALLET_BRAND_TYPES } from '@/constant';

export const useDisplayBrandName = (
  brandName: string = WALLET_BRAND_TYPES.WALLETCONNECT
) => {
  const displayBrandName =
    WALLET_BRAND_CONTENT[brandName]?.name ||
    WALLET_BRAND_CONTENT.WALLETCONNECT.name;

  return displayBrandName;
};
