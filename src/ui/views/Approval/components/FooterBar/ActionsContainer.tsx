import { Button } from 'antd';
import React from 'react';

export interface Props {
  onClickCancel(): void;
  children: React.ReactNode;
}

export const ActionsContainer: React.FC<Props> = ({
  children,
  onClickCancel,
}) => {
  return (
    <div className="flex items-center gap-[16px]">
      {children}
      <Button
        type="ghost"
        className="w-[100px] h-[40px] border-blue-light text-blue-light"
        onClick={onClickCancel}
      >
        Cancel
      </Button>
    </div>
  );
};
