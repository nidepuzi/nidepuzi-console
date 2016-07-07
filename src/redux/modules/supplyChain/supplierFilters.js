import createReducer from 'redux/createReducer';
import { apisBase, scheduleTypes } from 'constants';

const initialState = {
  categorys: [],
  supplierType: [],
  supplierZone: [],
};

const name = 'SUPPLIERS_FILTERS';

export default createReducer({
  [`FETCH_${name}_REQUEST`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`FETCH_${name}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    ...payload.data,
  }),
  [`FETCH_${name}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
}, initialState);

export const fetchFilters = () => ({
  url: `${apisBase.supply}supplier/list_filters`,
  method: 'get',
  type: `FETCH_${name}`,
});