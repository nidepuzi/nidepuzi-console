import createReducer from 'redux/createReducer';
import { apisBase, scheduleTypes } from 'constants';

const initialState = {

};

const name = 'SUPPLIER';

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

export const fetchSupplier = (id) => ({
  url: `${apisBase.supply}supplier/${id}`,
  method: 'get',
  type: `FETCH_${name}`,
});

export const saveSupplier = (params) => ({
  url: `${apisBase.supply}supplier`,
  method: 'post',
  type: `SAVE_${name}`,
  data: params,
});

export const updateSupplier = (id, params) => ({
  url: `${apisBase.supply}supplier/${id}`,
  method: 'PATCH',
  type: `SAVE_${name}`,
  data: params,
});
