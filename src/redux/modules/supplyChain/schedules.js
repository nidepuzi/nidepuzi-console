import createReducer from 'redux/createReducer';
import { apisBase, scheduleTypes } from 'constants';

const initialState = {
  items: [],
  count: 0,
};

const name = 'SCHEDULES';

export default createReducer({
  [`FETCH_${name}_REQUEST`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
  [`FETCH_${name}_SUCCESS`]: (state, { payload, status }) => ({
    ...state,
    ...status,
    items: payload.data.results.map((item => {
      const newItem = item;
      newItem.scheduleTypeLable = scheduleTypes[item.scheduleType].lable;
      return newItem;
    })) || [],
    count: payload.data.count,
  }),
  [`FETCH_${name}_FAILURE`]: (state, { payload, status }) => ({
    ...state,
    ...status,
  }),
}, initialState);

export const fetchSchedules = (filters) => ({
  url: `${apisBase.supply}saleschedule`,
  method: 'get',
  type: `FETCH_${name}`,
  params: {
    ...filters,
  },
});
