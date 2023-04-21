import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { useHistory } from 'react-router-dom';
import { Account } from 'background/service/preference';
import { CHAINS, CHAINS_ENUM, WALLETCONNECT_STATUS_MAP } from 'consts';
import { openInTab, useApprovalPopupView } from 'ui/utils';
import { SvgIconOpenExternal } from 'ui/assets';

import TXSendingSVG from 'ui/assets/walletconnect/tx-sending.svg';
import TXWaitingSVG from 'ui/assets/walletconnect/tx-waiting.svg';
import TXErrorSVG from 'ui/assets/walletconnect/tx-error.svg';
import TXRejectedSVG from 'ui/assets/walletconnect/tx-rejected.svg';
import TXSubmittedSVG from 'ui/assets/walletconnect/tx-submitted.svg';
import clsx from 'clsx';

type Valueof<T> = T[keyof T];

const Process = ({
  chain,
  result,
  status,
  account,
  error,
  onRetry,
  onCancel,
}: {
  chain: CHAINS_ENUM;
  result: string;
  status: Valueof<typeof WALLETCONNECT_STATUS_MAP>;
  account: Account;
  error: { code?: number; message?: string } | null;
  onRetry(): void;
  onCancel(): void;
}) => {
  const { setClassName } = useApprovalPopupView();
  const [address, setAddress] = useState<null | string>(null);
  const history = useHistory();
  const handleRetry = () => {
    onRetry();
  };
  const handleCancel = () => {
    onCancel();
  };
  const handleOK = () => {
    history.push('/');
  };
  const handleClickResult = () => {
    const url = CHAIN.scanLink.replace(/_s_/, result);
    openInTab(url);
  };
  const CHAIN = CHAINS[chain];
  const [image, setImage] = useState('');
  const [content, setContent] = useState('');
  let titleColor = '';
  let description = <></>;

  const init = async () => {
    setAddress(account.address);
    setClassName(undefined);
  };

  useEffect(() => {
    switch (status) {
      case WALLETCONNECT_STATUS_MAP.CONNECTED:
        setImage(TXSendingSVG);
        setContent('正在发送签名请求  1s');
        break;
      case WALLETCONNECT_STATUS_MAP.WAITING:
        setImage(TXWaitingSVG);
        setContent('发送成功，请在手机钱包签名');
        titleColor = '#8697FF';
        description = (
          <p className="text-gray-content text-14 text-center">
            {'Waiting for signature'}
          </p>
        );
        break;
      case WALLETCONNECT_STATUS_MAP.FAILD:
        setImage(TXErrorSVG);
        setContent('Connection failed');
        titleColor = '#F24822';

        break;
      case WALLETCONNECT_STATUS_MAP.SIBMITTED:
        setImage(TXSubmittedSVG);
        setContent('watch Transaction submitted');
        titleColor = '#27C193';
        description = (
          <p className="text-gray-content text-14 text-center">
            {'Your transaction has been submitted'}
          </p>
        );
        break;
      case WALLETCONNECT_STATUS_MAP.REJECTED:
        setImage(TXRejectedSVG);
        setContent('Transaction rejected');
        titleColor = '#F24822';
        description = (
          <p className="error-alert">
            {'You have refused to sign the transaction'}
          </p>
        );
        break;
    }
  }, [status, error]);

  useEffect(() => {
    init();
  }, []);

  return (
    <div className="flex flex-col items-center">
      <img src={image} className={'w-[160px] h-[160px]'} />
      <div
        className={clsx('text-[20px] font-bold mt-[16px]', {
          'text-[#EC5151]': status === WALLETCONNECT_STATUS_MAP.FAILD,
        })}
      >
        {content}
      </div>

      <div className="h-[40px] mt-[30px]">
        <div
          className={clsx('text-[15px] underline text-gray-subTitle')}
          onClick={handleRetry}
        >
          Retry
        </div>
      </div>
    </div>
  );

  // return (
  //   <div className="watchaddress-process">
  //     <img src={image} className="watchaddress-process__status" />
  //     <h2 className="watchaddress-process__title" style={{ color: titleColor }}>
  //       {title}
  //     </h2>
  //     {description}
  //     {result && status === WALLETCONNECT_STATUS_MAP.SIBMITTED && (
  //       <div className="watchaddress-process__result">
  //         <img className="icon icon-chain" src={CHAIN.logo} />
  //         <a
  //           href="javascript:;"
  //           className="tx-hash"
  //           onClick={handleClickResult}
  //         >
  //           {`${result.slice(0, 6)}...${result.slice(-4)}`}
  //           <SvgIconOpenExternal className="icon icon-external" />
  //         </a>
  //       </div>
  //     )}
  //     {(status === WALLETCONNECT_STATUS_MAP.CONNECTED ||
  //       status === WALLETCONNECT_STATUS_MAP.FAILD ||
  //       status === WALLETCONNECT_STATUS_MAP.WAITING ||
  //       status === WALLETCONNECT_STATUS_MAP.REJECTED) && (
  //       <div className="watchaddress-process__buttons">
  //         <Button type="link" onClick={handleRetry}>
  //           {'Retry'}
  //         </Button>
  //         <Button type="link" onClick={handleCancel}>
  //           {'Cancel'}
  //         </Button>
  //       </div>
  //     )}
  //     {status === WALLETCONNECT_STATUS_MAP.SIBMITTED && (
  //       <div className="watchaddress-process__ok">
  //         <Button
  //           type="primary"
  //           className="w-[200px]"
  //           size="large"
  //           onClick={handleOK}
  //         >
  //           {'OK'}
  //         </Button>
  //       </div>
  //     )}
  //   </div>
  // );
};

export default Process;
