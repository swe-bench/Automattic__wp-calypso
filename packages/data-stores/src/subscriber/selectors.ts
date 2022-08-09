import type { State } from './reducers';

export const getState = ( state: State ) => state;
export const getAddSubscribersSelector = ( state: State ) => state.subscriber.add;
export const getImportSubscribersSelector = ( state: State ) => state.subscriber.import;
export const getImportJobsSelector = ( state: State ) => state.subscriber.imports;
