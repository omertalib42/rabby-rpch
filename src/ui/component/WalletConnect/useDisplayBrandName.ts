import { WALLET_BRAND_CONTENT, WALLET_BRAND_TYPES } from '@/constant';

export const WALLET_BRAND_NAME_KEY = {};

Object.keys(WALLET_BRAND_CONTENT).forEach((key) => {
  WALLET_BRAND_NAME_KEY[WALLET_BRAND_CONTENT[key].name] = key;
});

export const useDisplayBrandName = (
  brandName: string = WALLET_BRAND_TYPES.WALLETCONNECT
) => {
  const displayBrandName =
    WALLET_BRAND_CONTENT[brandName]?.name ||
    WALLET_BRAND_CONTENT[WALLET_BRAND_NAME_KEY[brandName]]?.name;

  return displayBrandName;
};
