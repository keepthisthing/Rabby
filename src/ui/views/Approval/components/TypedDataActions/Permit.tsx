import React, { useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import BigNumber from 'bignumber.js';
import { Chain } from 'background/service/openapi';
import { Result } from '@rabby-wallet/rabby-security-engine';
import { ApproveTokenRequireData, TypedDataActionData } from './utils';
import { ellipsisTokenSymbol, getTokenSymbol } from 'ui/utils/token';
import { formatAmount } from '@/ui/utils/number';
import { useRabbyDispatch } from '@/ui/store';
import { Table, Col, Row } from '../Actions/components/Table';
import LogoWithText from '../Actions/components/LogoWithText';
import * as Values from '../Actions/components/Values';
import ViewMore from '../Actions/components/ViewMore';
import { SecurityListItem } from '../Actions/components/SecurityListItem';
import { ProtocolListItem } from '../Actions/components/ProtocolListItem';
import { SubCol, SubRow, SubTable } from '../Actions/components/SubTable';

const Wrapper = styled.div`
  .header {
    margin-top: 15px;
  }
  .icon-edit-alias {
    width: 13px;
    height: 13px;
    cursor: pointer;
  }
  .icon-scam-token {
    margin-left: 4px;
    width: 13px;
  }
  .icon-fake-token {
    margin-left: 4px;
    width: 13px;
  }
`;

const Permit = ({
  data,
  requireData,
  chain,
  engineResults,
}: {
  data: TypedDataActionData['permit'];
  requireData: ApproveTokenRequireData;
  chain?: Chain;
  engineResults: Result[];
}) => {
  const actionData = data!;
  const dispatch = useRabbyDispatch();
  const { t } = useTranslation();

  const engineResultMap = useMemo(() => {
    const map: Record<string, Result> = {};
    engineResults.forEach((item) => {
      map[item.id] = item;
    });
    return map;
  }, [engineResults]);

  const tokenBalance = useMemo(() => {
    return new BigNumber(requireData.token.raw_amount || '0')
      .div(10 ** requireData.token.decimals)
      .toFixed();
  }, [requireData]);

  return (
    <Wrapper>
      <Table>
        <Col>
          <Row isTitle>{t('page.signTx.tokenApprove.approveToken')}</Row>
          <Row className="overflow-hidden pl-6">
            <LogoWithText
              className="overflow-hidden"
              id="permit-token"
              logo={actionData.token.logo_url}
              text={
                <div className="overflow-hidden overflow-ellipsis flex">
                  <Values.TokenAmount value={actionData.token.amount} />
                  <span className="mr-2">
                    <Values.TokenSymbol token={actionData.token} />
                  </span>
                </div>
              }
              logoRadius="100%"
            />
          </Row>
        </Col>
        <SubTable target="permit-token">
          <SubCol>
            <SubRow isTitle>{t('page.signTx.tokenApprove.myBalance')}</SubRow>
            <SubRow className="flex">
              <Values.TokenAmount value={tokenBalance} />
              <span className="ml-4">
                {ellipsisTokenSymbol(getTokenSymbol(actionData.token))}
              </span>
            </SubRow>
          </SubCol>
        </SubTable>
        <Col>
          <Row isTitle tip={t('page.signTypedData.permit2.sigExpireTimeTip')}>
            {t('page.signTypedData.permit2.sigExpireTime')}
          </Row>
          <Row>
            {actionData.expire_at ? (
              <Values.TimeSpanFuture to={actionData.expire_at} />
            ) : (
              '-'
            )}
          </Row>
        </Col>
        <Col>
          <Row isTitle>{t('page.signTx.tokenApprove.approveTo')}</Row>
          <Row>
            <ViewMore
              type="spender"
              data={{
                ...requireData,
                spender: actionData.spender,
                chain,
              }}
            >
              <Values.Address
                id="permit-address"
                hasHover
                address={actionData.spender}
                chain={chain}
              />
            </ViewMore>
          </Row>
        </Col>
        <SubTable target="permit-address">
          <SubCol>
            <SubRow isTitle>{t('page.signTx.protocol')}</SubRow>
            <SubRow>
              <ProtocolListItem protocol={requireData.protocol} />
            </SubRow>
          </SubCol>

          <SecurityListItem
            id="1077"
            engineResult={engineResultMap['1077']}
            dangerText={t('page.signTx.tokenApprove.eoaAddress')}
            title={t('page.signTx.addressTypeTitle')}
          />

          <SecurityListItem
            id="1080"
            engineResult={engineResultMap['1080']}
            warningText={<Values.Interacted value={false} />}
            defaultText={
              <Values.Interacted value={requireData.hasInteraction} />
            }
            title={t('page.signTx.interacted')}
          />

          <SecurityListItem
            id="1078"
            engineResult={engineResultMap['1078']}
            dangerText={t('page.signTx.tokenApprove.trustValueLessThan', {
              value: '$10,000',
            })}
            warningText={t('page.signTx.tokenApprove.trustValueLessThan', {
              value: '$100,000',
            })}
            title={t('page.signTx.trustValueTitle')}
          />

          <SecurityListItem
            id="1079"
            engineResult={engineResultMap['1079']}
            warningText={t('page.signTx.tokenApprove.deployTimeLessThan', {
              value: '3',
            })}
            title={t('page.signTx.deployTimeTitle')}
          />

          <SecurityListItem
            id="1106"
            engineResult={engineResultMap['1106']}
            title={t('page.signTx.tokenApprove.flagByRabby')}
            dangerText={t('page.signTx.yes')}
          />

          <SecurityListItem
            id="1134"
            engineResult={engineResultMap['1134']}
            forbiddenText={t('page.signTx.markAsBlock')}
            title={t('page.signTx.myMark')}
          />

          <SecurityListItem
            id="1136"
            engineResult={engineResultMap['1136']}
            warningText={t('page.signTx.markAsBlock')}
            title={t('page.signTx.myMark')}
          />

          <SecurityListItem
            id="1133"
            engineResult={engineResultMap['1133']}
            safeText={t('page.signTx.markAsTrust')}
            title={t('page.signTx.myMark')}
          />
        </SubTable>
      </Table>
    </Wrapper>
  );
};

export default Permit;
