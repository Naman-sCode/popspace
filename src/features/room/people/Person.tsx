import * as React from 'react';
import { PersonBubble } from './PersonBubble';
import { useRoomStore } from '@api/useRoomStore';
import { useSoundEffects } from '@components/SoundEffectProvider/useSoundEffects';
import { CanvasObject } from '@providers/canvas/CanvasObject';
import { CanvasObjectDragHandle } from '@providers/canvas/CanvasObjectDragHandle';
import { makeStyles } from '@material-ui/core';
import { usePersonStreams } from './usePersonStreams';
import { useIsMe } from '@api/useIsMe';
import { SIZE_AVATAR } from './constants';

import { useAddAccessory } from '../../roomControls/addContent/quickActions/useAddAccessory';
import { getTrackName } from '@utils/trackNames';
import { WidgetType } from '@api/roomState/types/widgets';
import { INITIAL_SIZE } from '../widgets/sidecarStream/constants';

const MAX_Z_INDEX = 2147483647;
export interface IPersonProps {
  personId: string;
}

const useStyles = makeStyles(() => ({
  dragHandle: {
    width: '100%',
    height: '100%',
  },
}));

export const Person = React.memo<IPersonProps>(({ personId }) => {
  const classes = useStyles();

  const isMe = useIsMe(personId);
  const person = useRoomStore(React.useCallback((room) => room.users[personId], [personId]));

  const { mainStream, secondaryStreams: sidecarStreams } = usePersonStreams(personId);

  const addWidget = useAddAccessory();

  // play a sound when any other person first enters the room
  const { playSound } = useSoundEffects();
  React.useEffect(() => {
    if (person && !isMe) {
      playSound('join');
    }
  }, [person, isMe, playSound]);

  React.useEffect(() => {
    sidecarStreams.forEach((stream) => {
      addWidget({
        type: WidgetType.SidecarStream,
        initialData: {
          twilioParticipantIdentity: stream.participantIdentity,
          videoTrackName: getTrackName(stream.videoPublication) ?? undefined,
          audioTrackName: getTrackName(stream.audioPublication) ?? undefined,
        },
        size: INITIAL_SIZE,
      });
    });
  }, [sidecarStreams, addWidget]);

  if (!person) {
    return null;
  }

  return (
    <CanvasObject
      objectId={personId}
      zIndex={isMe ? MAX_Z_INDEX : MAX_Z_INDEX - 1}
      objectKind="person"
      origin="center"
      preserveAspect
      minHeight={SIZE_AVATAR.height}
      minWidth={SIZE_AVATAR.width}
    >
      <CanvasObjectDragHandle disabled={!isMe} className={classes.dragHandle}>
        <PersonBubble person={person} isMe={isMe} mainStream={mainStream} sidecarStreams={sidecarStreams} />
      </CanvasObjectDragHandle>
    </CanvasObject>
  );
});
