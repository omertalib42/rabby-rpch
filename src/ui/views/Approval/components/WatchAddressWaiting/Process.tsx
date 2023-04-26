import React from 'react';
import { Account } from 'background/service/preference';
import {
  CHAINS_ENUM,
  WALLETCONNECT_STATUS_MAP,
  WALLET_BRAND_CONTENT,
} from 'consts';
import { useCommonPopupView } from 'ui/utils';
import clsx from 'clsx';
import {
  WALLET_BRAND_NAME_KEY,
  useDisplayBrandName,
} from '@/ui/component/WalletConnect/useDisplayBrandName';
import { useWalletConnectIcon } from '@/ui/component/WalletConnect/useWalletConnectIcon';

import TXWaitingSVG from 'ui/assets/approval/tx-waiting.svg';
import TXErrorSVG from 'ui/assets/approval/tx-error.svg';
import TXSubmittedSVG from 'ui/assets/approval/tx-submitted.svg';
import { FooterResend } from './FooterResend';
import { FooterResendButton } from './FooterResendButton';
import { FooterDoneButton } from './FooterDoneButton';
import { FooterResendCancelGroup } from './FooterResendCancelGroup';
import { useInterval } from 'react-use';

type Valueof<T> = T[keyof T];

const Process = ({
  status,
  account,
  error,
  onRetry,
  onCancel,
  onDone,
}: {
  chain: CHAINS_ENUM;
  result: string;
  status: Valueof<typeof WALLETCONNECT_STATUS_MAP>;
  account: Account;
  error: { code?: number; message?: string } | null;
  onRetry(): void;
  onCancel(): void;
  onDone(): void;
}) => {
  const { setClassName, setTitle: setPopupViewTitle } = useCommonPopupView();
  const displayBrandName = useDisplayBrandName(account.brandName);
  const brandRealUrl = useWalletConnectIcon(account);
  const brandUrl = React.useMemo(() => {
    return (
      brandRealUrl ||
      WALLET_BRAND_CONTENT[displayBrandName]?.icon ||
      WALLET_BRAND_CONTENT[WALLET_BRAND_NAME_KEY[displayBrandName]]?.icon ||
      WALLET_BRAND_CONTENT.WALLETCONNECT.icon
    );
  }, [brandRealUrl]);
  const handleRetry = () => {
    onRetry();
  };
  const handleCancel = () => {
    onCancel();
  };

  const [sendingCounter, setSendingCounter] = React.useState(5);
  const [image, setImage] = React.useState('');
  const [content, setContent] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [contentColor, setContentColor] = React.useState('');

  useInterval(() => {
    setSendingCounter((prev) => prev - 1);
  }, 1000);

  const mergedStatus = React.useMemo(() => {
    if (sendingCounter <= 0) {
      setSendingCounter(5);
      return WALLETCONNECT_STATUS_MAP.FAILD;
    }
    return status;
  }, [status]);

  React.useEffect(() => {
    setPopupViewTitle(`Sign with ${displayBrandName}`);
  }, [displayBrandName]);

  const init = async () => {
    setClassName(undefined);
  };

  React.useEffect(() => {
    switch (mergedStatus) {
      case WALLETCONNECT_STATUS_MAP.CONNECTED:
        setImage('/images/tx-sending.gif');
        setContent('Sending signing request');
        setDescription('');
        setContentColor('text-gray-title');
        break;
      case WALLETCONNECT_STATUS_MAP.WAITING:
        setImage(TXWaitingSVG);
        setContent('Request successfully sent. ');
        setDescription('Please sign on your mobile wallet.');
        setContentColor('text-gray-title');
        break;
      case WALLETCONNECT_STATUS_MAP.FAILD:
        setImage(TXErrorSVG);
        setContent('Signing request failed to send');
        setDescription('');
        setContentColor('bg-red-forbidden');
        break;
      case WALLETCONNECT_STATUS_MAP.SIBMITTED:
        setImage(TXSubmittedSVG);
        setContent('Transaction submitted');
        setDescription('');
        setContentColor('text-gray-title');
        break;
      case WALLETCONNECT_STATUS_MAP.REJECTED:
        setImage(TXErrorSVG);
        setContent('Transaction rejected');
        setDescription('');
        setContentColor('bg-red-forbidden');
        break;
    }
  }, [mergedStatus, error]);

  React.useEffect(() => {
    init();
  }, []);

  return (
    <div
      className={clsx(
        'flex flex-col items-center mt-[20px]',
        'relative h-full'
      )}
    >
      <div
        className={clsx(
          'w-[80px] h-[80px] rounded-full',
          'border-[#E5E9EF] border-[2px]',
          'relative'
        )}
      >
        <img src={brandUrl} className={'w-full h-full'} />
        <div
          className={clsx(
            'w-[32px] h-[32px] rounded-full',
            'absolute bottom-[-6px] right-[-6px]',
            'border border-[#E5E9EF]',
            'bg-[#8697FF]',
            'flex'
          )}
        >
          <img src={image} className={'m-auto'} />
        </div>
      </div>
      <div
        className={clsx('text-[20px] font-bold mt-[40px]', {
          contentColor,
        })}
      >
        {content}
        {status === WALLETCONNECT_STATUS_MAP.CONNECTED && (
          <span> ({sendingCounter}s)</span>
        )}
      </div>
      <div
        className={clsx('text-[20px] font-bold', {
          contentColor,
        })}
      >
        {description}
      </div>

      <div className="h-[40px] absolute bottom-[10px]">
        {status === WALLETCONNECT_STATUS_MAP.CONNECTED && (
          <FooterResend onResend={handleRetry} />
        )}
        {status === WALLETCONNECT_STATUS_MAP.WAITING && (
          <FooterResend onResend={handleRetry} />
        )}
        {status === WALLETCONNECT_STATUS_MAP.FAILD && (
          <FooterResendButton onResend={handleRetry} />
        )}
        {status === WALLETCONNECT_STATUS_MAP.SIBMITTED && (
          <FooterDoneButton onDone={onDone} />
        )}
        {status === WALLETCONNECT_STATUS_MAP.REJECTED && (
          <FooterResendCancelGroup
            onResend={handleRetry}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
};

export default Process;
