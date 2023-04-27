import { Account } from '@/background/service/preference';
import { KEYRING_CLASS } from '@/constant';
import { AddressViewer } from '@/ui/component';
import useCurrentBalance from '@/ui/hooks/useCurrentBalance';
import { splitNumberByStep, useWallet } from '@/ui/utils';
import clsx from 'clsx';
import React from 'react';
import { WalletConnectAccount } from './WalletConnectAccount';

export const AccountInfo: React.FC = () => {
  const [account, setAccount] = React.useState<Account>();
  const [nickname, setNickname] = React.useState<string>();
  const [balance] = useCurrentBalance(account?.address);
  const displayBalance = splitNumberByStep((balance || 0).toFixed(2));
  const wallet = useWallet();

  const init = async () => {
    const currentAccount = await wallet.syncGetCurrentAccount();
    if (currentAccount) setAccount(currentAccount);
    const result = await wallet.getAlianName(
      currentAccount?.address?.toLowerCase() || ''
    );
    setNickname(result);
  };

  React.useEffect(() => {
    init();
  }, []);

  return (
    <div
      className={clsx(
        'bg-[#EFF1FC] rounded-[8px]',
        'py-[14px] px-[16px]',
        'space-y-10'
      )}
    >
      <div className={clsx('flex items-center justify-between')}>
        <div className="space-x-6 flex items-center">
          <div className="text-gray-title text-15">{nickname}</div>
          {account && (
            <AddressViewer
              showArrow={false}
              address={account.address}
              className={clsx('text-13 text-gray-subTitle')}
            />
          )}
        </div>
        <div title={displayBalance}>${displayBalance}</div>
      </div>
      {account?.type === KEYRING_CLASS.WALLETCONNECT && (
        <WalletConnectAccount account={account} />
      )}
    </div>
  );
};
