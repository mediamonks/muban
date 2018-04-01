/* global process */

import DeviceStateTracker, { DeviceStateEvent } from 'seng-device-state-tracker';
import { DeviceState } from '../data/enum/DeviceState';
import mediaQueries from '../data/variables/media-queries.json';

const deviceStateTracker: DeviceStateTracker = new DeviceStateTracker({
  mediaQueries: {
    MEDIUM: mediaQueries['breakpoint-medium'],
    LARGE: mediaQueries['breakpoint-large'],
    X_LARGE: mediaQueries['breakpoint-xlarge'],
    XX_LARGE: mediaQueries['breakpoint-xxlarge'],
  },
  deviceState: DeviceState,
  showStateIndicator: process.env.NODE_ENV === 'development',
});

export default deviceStateTracker;
