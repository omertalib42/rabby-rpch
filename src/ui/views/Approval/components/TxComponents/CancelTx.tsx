import useBalanceChange from '@/ui/hooks/useBalanceChange';
import { ExplainTxResponse, Tx } from 'background/service/openapi';
import clsx from 'clsx';
import { CHAINS, CHAINS_ENUM } from 'consts';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import IconArrowRight from 'ui/assets/arrow-right-gray.svg';
import IconCancelTx from 'ui/assets/cancel-tx.svg';
import BalanceChange from './BalanceChange';
import SpeedUpCorner from './SpeedUpCorner';
import ViewRawModal from './ViewRawModal';

const CancelTx = ({
  chainEnum,
  data,
  tx,
  isSpeedUp,
  raw,
}: {
  chainEnum: CHAINS_ENUM;
  data: ExplainTxResponse;
  tx: Tx;
  isSpeedUp: boolean;
  raw: Record<string, string | number>;
}) => {
  const chain = CHAINS[chainEnum];
  const { t } = useTranslation();

  const handleViewRawClick = () => {
    ViewRawModal.open({
      raw,
      abi: data?.abi_str,
    });
  };

  const bfInfo = useBalanceChange(data);

  return (
    <div
      className={clsx(
        'cancel-tx',
        bfInfo.belowBlockIsEmpty && 'below-bc-block-empty'
      )}
    >
      <p className="section-title">
        <Trans
          i18nKey="signTransactionWithChain"
          values={{ name: chain.name }}
        />
        <span
          className="float-right text-12 cursor-pointer flex items-center view-raw"
          onClick={handleViewRawClick}
        >
          {t('View Raw')}
          <img src={IconArrowRight} />
        </span>
      </p>
      <div className="action-card">
        <div className="common-detail-block">
          {isSpeedUp && <SpeedUpCorner />}
          <p className="title">{t('Cancel Pending Transaction')}</p>
          <p className="text-gray-content text-14 mb-0">
            Nonce: {Number(tx.nonce)}
          </p>
          <img src={IconCancelTx} className="icon icon-cancel-tx" />
        </div>

        <BalanceChange
          version={data.pre_exec_version}
          data={data.balance_change}
          chainEnum={chainEnum}
          isSupport={data.support_balance_change}
        />
      </div>
    </div>
  );
};

export default CancelTx;
