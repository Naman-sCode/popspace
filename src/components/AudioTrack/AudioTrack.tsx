import React, { useEffect, useRef } from 'react';
import { AudioTrack as IAudioTrack } from 'twilio-video';

interface AudioTrackProps {
  track: IAudioTrack;
  volume: number;
  id?: string;
}

export default function AudioTrack({ track, volume, id }: AudioTrackProps) {
  const ref = useRef<HTMLAudioElement>(null!);

  useEffect(() => {
    const el = ref.current;
    track.attach(el);
    return () => {
      track.detach(el);
    };
  }, [track]);

  useEffect(() => {
    // sanity check
    if (!isNaN(volume)) {
      ref.current.volume = volume;
    }
  }, [volume]);

  return <audio ref={ref} id={id} />;
}
