import { Popup } from '@/ui/component';
import { useApprovalPopupView } from '@/ui/utils';
import React from 'react';
import Approval from '../Approval';

export const ApprovalPopup: React.FC = () => {
  const {
    visible,
    setVisible,
    title,
    height,
    className,
  } = useApprovalPopupView();

  return (
    <Popup
      title={<span className="text-[16px]">{title}</span>}
      closable
      height={height}
      onClose={() => setVisible(false)}
      visible={visible}
      className={className}
    >
      {visible && <Approval className="h-full" />}
    </Popup>
  );
};
