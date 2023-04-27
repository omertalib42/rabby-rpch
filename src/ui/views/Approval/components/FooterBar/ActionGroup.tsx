import { Account } from '@/background/service/preference';
import { KEYRING_CLASS } from '@/constant';
import React from 'react';
import { ProcessActions } from './ProcessActions';

export interface Props {
  account: Account;
  onCancel: () => void;
  onProcess: () => void;
}

export const ActionGroup: React.FC<Props> = ({
  account,
  onCancel,
  onProcess,
}) => {
  return (
    <div>
      {account.type === KEYRING_CLASS.WALLETCONNECT && (
        <ProcessActions
          account={account}
          onClickCancel={onCancel}
          onClickProcess={onProcess}
        />
      )}
    </div>
  );
};
