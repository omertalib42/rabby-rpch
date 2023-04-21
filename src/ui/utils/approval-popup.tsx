import { KEYRING_CLASS } from '@/constant';
import { Approval } from 'background/service/notification';
import { useApprovalPopupView } from './WalletContext';

/**
 * New popup window for approval
 * Current only support walletconnect(2023-04)
 */
export const useApprovalPopup = () => {
  const { setVisible } = useApprovalPopupView();

  const showPopup = (approval: Approval) => {
    console.log(approval);
    setVisible(true);
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
