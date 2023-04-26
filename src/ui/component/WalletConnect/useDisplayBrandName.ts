import { WALLET_BRAND_CONTENT, WALLET_BRAND_TYPES } from '@/constant';

const WHITE_LIST = {};

Object.keys(WALLET_BRAND_CONTENT).forEach((key) => {
  WHITE_LIST[WALLET_BRAND_CONTENT[key].name] = WALLET_BRAND_CONTENT[key].name;
});

export const useDisplayBrandName = (
  brandName: string = WALLET_BRAND_TYPES.WALLETCONNECT
) => {
  const displayBrandName =
    WALLET_BRAND_CONTENT[brandName]?.name || WHITE_LIST[brandName];

  return displayBrandName;
};
