import { Button } from 'antd';
import React from 'react';
import { ActionsContainer } from './ActionsContainer';
import { useStatus } from '@/ui/component/WalletConnect/useStatus';
import { Account } from '@/background/service/preference';

export interface Props {
  onClickProcess(): void;
  onClickCancel(): void;
  account: Account;
}

export const ProcessActions: React.FC<Props> = ({
  onClickProcess,
  onClickCancel,
  account,
}) => {
  const status = useStatus(account);

  return (
    <ActionsContainer onClickCancel={onClickCancel}>
      <Button
        disabled={status !== 'CONNECTED'}
        type="ghost"
        className="w-[244px] h-[40px] border-blue-light text-blue-light"
        onClick={onClickProcess}
      >
        Begin signing process
      </Button>
    </ActionsContainer>
  );
};
