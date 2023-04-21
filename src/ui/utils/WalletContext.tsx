import React, { ReactNode, createContext, useContext, useState } from 'react';
import { Object } from 'ts-toolbelt';
import { WalletController as WalletControllerClass } from 'background/controller/wallet';
import { IExtractFromPromise } from './type';

// TODO: implement here but not used now to avoid too much ts checker error.
// we will use it on almost biz store ready.
export type WalletControllerType = Object.Merge<
  {
    [key in keyof WalletControllerClass]: WalletControllerClass[key] extends (
      ...args: infer ARGS
    ) => infer RET
      ? <T extends IExtractFromPromise<RET> = IExtractFromPromise<RET>>(
          ...args: ARGS
        ) => Promise<IExtractFromPromise<T>>
      : WalletControllerClass[key];
  },
  Record<string, <T = any>(...params: any) => Promise<T>>
>;

export type WalletController = Object.Merge<
  {
    openapi: {
      [key: string]: <T = any>(...params: any) => Promise<T>;
    };
  },
  Record<string, <T = any>(...params: any) => Promise<T>>
>;

const useApprovalPopupViewState = () => {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('Sign');
  const [height, setHeight] = useState(360);
  const [className, setClassName] = useState<'isConnectView' | undefined>();

  return {
    visible,
    setVisible,
    title,
    setTitle,
    height,
    setHeight,
    className,
    setClassName,
  };
};

const WalletContext = createContext<{
  wallet: WalletController;
  approvalPopupView: ReturnType<typeof useApprovalPopupViewState>;
} | null>(null);

const WalletProvider = ({
  children,
  wallet,
}: {
  children?: ReactNode;
  wallet: WalletController;
}) => {
  const approvalPopupView = useApprovalPopupViewState();

  return (
    <WalletContext.Provider value={{ wallet, approvalPopupView }}>
      {children}
    </WalletContext.Provider>
  );
};

const useWallet = () => {
  const { wallet } = (useContext(WalletContext) as unknown) as {
    wallet: WalletControllerType;
  };

  return wallet;
};

const useApprovalPopupView = () => {
  const { approvalPopupView } = (useContext(WalletContext) as unknown) as {
    approvalPopupView: ReturnType<typeof useApprovalPopupViewState>;
  };

  return approvalPopupView;
};

export { WalletProvider, useWallet, useApprovalPopupView };
