import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { Oprations } from 'modules/operations/Home';
import { ChangeMmUpper } from 'modules/operations/ChangeMmUpper';
import { GiveTransferCoupon } from 'modules/operations/GiftTransferCoupon';
import { SendEliteScore } from 'modules/operations/SendTransferEliteScore';
import { SendEnvelopUserBudget } from 'modules/operations/SendEnvelopUserBudget';
import { GiveXiaoluCoin } from 'modules/operations/GiveXiaoluCoin';

export default (
  <Route path="/operations" breadcrumbName="运营操作">
    <IndexRoute component={Oprations} />
    <Route path="/operations/changemmupper" breadcrumbName="更改推荐关系" component={ChangeMmUpper} />
    <Route path="/operations/sendenvelopuserbudget" breadcrumbName="给用户钱包发送红包" component={SendEnvelopUserBudget} />
  </Route>
);
