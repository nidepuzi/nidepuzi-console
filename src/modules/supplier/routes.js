import React from 'react';
import { Route, IndexRoute } from 'react-router';
import { Home } from 'modules/supplier/Home';
import { Edit } from 'modules/supplier/Edit';
import { Products } from 'modules/supplier/Products';

export default (
  <Route path="/supplier" breadcrumbName="供应商">
    <IndexRoute component={Home} />
    <Route path="/supplier/edit" breadcrumbName="编辑" component={Edit} />
    <Route path="/supplier/products" breadcrumbName="商品" component={Products} />
  </Route>
);
