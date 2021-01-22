import { vectorDistance } from '../../utils/math';
import { useEffect, useLayoutEffect, useRef } from 'react';
import { RoomStateShape, useRoomStore } from '../../roomState/useRoomStore';
import { logger } from '../../utils/logger';

// in world space coordinates - this is the farthest possible distance
// you can hear someone / something from - even if very faintly.
// To allow people to find quiet spaces, we probably want this to be
// no larger than 3/4 the room size, maybe smaller
const MAX_RANGE = 1200;

function computeVolumeFalloff(percentOfMaxRange: number) {
  return 1 / (Math.pow(percentOfMaxRange + 0.4, 20) + 1);
}

/**
 * Calls the supplied callback every time the volume changes based on
 * the room object you provide and its position relative to the user
 *
 * @returns a ref to the last recorded volume value for out-of-band usage
 */
export function useSpatialAudioVolume(
  objectKind: 'widget' | 'user',
  objectId: string | null,
  callback: (volume: number) => any
) {
  // storing in a ref to keep a stable reference
  const callbackRef = useRef(callback);
  useLayoutEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const lastValue = useRef(0);

  useEffect(() => {
    const selectVolume = (room: RoomStateShape) => {
      if (!room.sessionId) return 0;

      const objPosition =
        objectKind === 'widget'
          ? room.widgetPositions[objectId ?? '']?.position
          : room.userPositions[objectId ?? '']?.position;
      const userPosition = room.userPositions[room.sessionLookup[room.sessionId]]?.position;

      if (!objPosition || !userPosition) return 0;

      const normalizedDistance =
        Math.max(Math.min(vectorDistance(objPosition, userPosition), MAX_RANGE), 0) / MAX_RANGE;
      return computeVolumeFalloff(normalizedDistance);
    };

    lastValue.current = selectVolume(useRoomStore.getState());

    return useRoomStore.subscribe((volume: number) => {
      lastValue.current = volume;
      // sanity check
      if (!isNaN(volume) && Number.isFinite(volume)) {
        callbackRef.current(volume);
      } else {
        logger.warn(`NaN volume for ${objectId}!`);
      }
    }, selectVolume);
  }, [objectId, objectKind, callbackRef]);

  return lastValue;
}
