/**
 * This enum is used by the DeviceStateTracker class to determine which of the media queries in
 * the mediaQueries object above are considered 'device states'. Names of this enum have to
 * correspond with one of the keys in the mediaQueries object. When using the DeviceStateTracker,
 * make sure you have enough device states so that there will always be one with a matching media
 * query.
 */
export enum DeviceState {
  MEDIUM,
  LARGE,
  X_LARGE,
  XX_LARGE,
}
