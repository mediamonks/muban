/* global process */

import DeviceStateTracker from 'seng-device-state-tracker';
import mq from '../data/shared-variable/media-queries.json';

const cleanMediaQueries = Object.keys(mq.mediaQueries).reduce<{ [key: string]: string }>(
  (result, key: string) => {
    // eslint-disable-next-line no-param-reassign
    result[key] = mq.mediaQueries[key].replace(/'/g, '');
    return result;
  },
  {},
);

const deviceStateTracker: DeviceStateTracker = new DeviceStateTracker({
  deviceState: mq.deviceState,
  mediaQueries: cleanMediaQueries,
  showStateIndicator: process.env.NODE_ENV === 'development',
});

export default deviceStateTracker;
