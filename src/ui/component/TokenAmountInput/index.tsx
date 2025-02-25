import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Input } from 'antd';
import cloneDeep from 'lodash/cloneDeep';
import BigNumber from 'bignumber.js';
import { TokenItem } from 'background/service/openapi';
import { splitNumberByStep, useWallet, useWalletOld } from 'ui/utils';
import TokenWithChain from '../TokenWithChain';
import TokenSelector, {
  isSwapTokenType,
  TokenSelectorProps,
} from '../TokenSelector';
import IconArrowDown from 'ui/assets/arrow-down-triangle.svg';
import './style.less';
import clsx from 'clsx';

interface TokenAmountInputProps {
  token: TokenItem;
  value?: string;
  onChange?(amount: string): void;
  onTokenChange(token: TokenItem): void;
  chainId: string;
  amountFocus?: boolean;
  inlinePrize?: boolean;
  excludeTokens?: TokenItem['id'][];
  className?: string;
  type?: TokenSelectorProps['type'];
  placeholder?: string;
}

const TokenAmountInput = ({
  token,
  value,
  onChange,
  onTokenChange,
  chainId,
  amountFocus,
  inlinePrize,
  excludeTokens = [],
  className,
  type = 'default',
  placeholder,
}: TokenAmountInputProps) => {
  const tokenInputRef = useRef<Input>(null);
  const latestChainId = useRef(chainId);
  const latestTokenId = useRef(token.id);
  const [tokens, setTokens] = useState<TokenItem[]>([]);
  const [originTokenList, setOriginTokenList] = useState<TokenItem[]>([]);
  const [isListLoading, setIsListLoading] = useState(true);
  const [tokenSelectorVisible, setTokenSelectorVisible] = useState(false);
  const wallet = useWalletOld();
  if (amountFocus && !tokenSelectorVisible) {
    tokenInputRef.current?.focus();
  }
  const handleCurrentTokenChange = (token: TokenItem) => {
    onChange && onChange('');
    onTokenChange(token);
    setTokenSelectorVisible(false);
    tokenInputRef.current?.focus();
  };

  const handleTokenSelectorClose = () => {
    setTokenSelectorVisible(false);
  };

  const handleSelectToken = () => {
    setTokenSelectorVisible(true);
    handleLoadTokens();
  };

  const sortTokensByPrice = (tokens: TokenItem[]) => {
    const copy = cloneDeep(tokens);
    return copy.sort((a, b) => {
      return new BigNumber(b.amount)
        .times(new BigNumber(b.price || 0))
        .minus(new BigNumber(a.amount).times(new BigNumber(a.price || 0)))
        .toNumber();
    });
  };

  const availableToken = useMemo(
    () => tokens.filter((e) => !excludeTokens.includes(e.id)),
    [tokens, excludeTokens]
  );

  const isSwapType = isSwapTokenType(type);

  const handleLoadTokens = async () => {
    setIsListLoading(true);
    let tokens: TokenItem[] = [];
    const currentAccount = await wallet.syncGetCurrentAccount();
    const getDefaultTokens = isSwapType
      ? wallet.openapi.getSwapTokenList
      : wallet.openapi.listToken;
    const defaultTokens = await getDefaultTokens(
      currentAccount?.address,
      chainId
    );
    let localAddedTokens: TokenItem[] = [];

    if (!isSwapType) {
      const localAdded =
        (await wallet.getAddedToken(currentAccount?.address)).filter((item) => {
          const [chain] = item.split(':');
          return chain === chainId;
        }) || [];
      if (localAdded.length > 0) {
        localAddedTokens = await wallet.openapi.customListToken(
          localAdded,
          currentAccount?.address
        );
      }
    }

    if (chainId !== latestChainId.current) return;
    tokens = sortTokensByPrice([...defaultTokens, ...localAddedTokens]);
    setOriginTokenList(tokens);
    setTokens(tokens);
    setIsListLoading(false);
  };

  const handleSearchTokens = async (q: string) => {
    if (!q) {
      setTokens(originTokenList);
      return;
    }
    const kw = q.trim();
    if (isSwapType) {
      setIsListLoading(true);
      try {
        const currentAccount = await wallet.syncGetCurrentAccount();
        const data = await wallet.openapi.searchSwapToken(
          currentAccount!.address,
          chainId,
          q
        );
        setTokens(data);
      } catch (error) {
        console.error('swap search error :', error);
      }
      setIsListLoading(false);

      return;
    }
    setTokens(
      originTokenList.filter((token) => {
        if (kw.length === 42 && kw.startsWith('0x')) {
          return token.id.toLowerCase() === kw.toLowerCase();
        } else {
          const reg = new RegExp(kw, 'i');
          return reg.test(token.name) || reg.test(token.symbol);
        }
      })
    );
  };

  useEffect(() => {
    setTokens([]);
    setOriginTokenList([]);
    latestChainId.current = chainId;
  }, [chainId]);

  useEffect(() => {
    latestTokenId.current = token.id;
  }, [token]);

  return (
    <div className={clsx('token-amount-input', className)}>
      <div className="left" onClick={handleSelectToken}>
        <TokenWithChain token={token} hideConer />
        <span className="token-input__symbol" title={token.symbol}>
          {token.symbol}
        </span>
        <img src={IconArrowDown} className="icon icon-arrow-down" />
      </div>
      <div className="right relative flex flex-col items-end">
        <Input
          ref={tokenInputRef}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          title={value}
        />
        {inlinePrize && (
          <div className="text-gray-content text-12 text-right ">
            {Number(value)
              ? `≈$${splitNumberByStep(
                  ((Number(value) || 0) * token.price || 0).toFixed(2)
                )}`
              : ''}
          </div>
        )}
      </div>
      <TokenSelector
        visible={tokenSelectorVisible}
        list={availableToken}
        onConfirm={handleCurrentTokenChange}
        onCancel={handleTokenSelectorClose}
        onSearch={handleSearchTokens}
        isLoading={isListLoading}
        type={type}
        placeholder={placeholder}
        chainId={chainId}
      />
    </div>
  );
};

export default TokenAmountInput;
