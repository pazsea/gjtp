import { combineReducers } from 'redux';
import sessionReducer from './session';
import userReducer from './user';
import messageReducer from './message';
import screenSizeReducer from './screenSize';
import loadStatusReducer from './loadStatus';
import bulkLoadReducer from './bulkLoad';
import sortParfumeReducer from './sortParfumes';

const rootReducer = combineReducers({
  sessionState: sessionReducer,
  userState: userReducer,
  messageState: messageReducer,
  screenSizeState: screenSizeReducer,
  loadStatusState: loadStatusReducer,
  sniphBulkDataState: bulkLoadReducer,
  sortedParfumesState: sortParfumeReducer,
});

export default rootReducer;
