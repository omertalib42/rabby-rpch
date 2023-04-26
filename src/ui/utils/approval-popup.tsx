import { KEYRING_CLASS } from '@/constant';
import { useCommonPopupView } from './WalletContext';

/**
 * New popup window for approval
 * Current only support walletconnect(2023-04)
 */
export const useApprovalPopup = () => {
  const { setVisible } = useCommonPopupView();

  const showPopup = () => {
    setVisible('Approval');
  };

  const enablePopup = (type: string) => {
    if (type === KEYRING_CLASS.WALLETCONNECT) {
      return true;
    }

    return false;
  };

  return {
    showPopup,
    enablePopup,
  };
};
