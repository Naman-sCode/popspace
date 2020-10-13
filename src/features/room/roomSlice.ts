import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { EmojiData } from 'emoji-mart';
import { Bounds, Vector2 } from '../../types/spatials';
import { RootState } from '../../state/store';
import { clamp } from '../../utils/math';
import { BackgroundName } from '../../withComponents/BackgroundPicker/options';
import { WidgetState, PersonState, WidgetType, WidgetData } from '../../types/room';
import { MIN_WIDGET_HEIGHT, MIN_WIDGET_WIDTH } from '../../constants/room';

/**
 * Positioning data for an object in a room,
 * along with a reference to the object itself.
 */
export type ObjectPositionData = {
  /**
   * RoomObject positions are in "world space" pixel values - i.e. pixel
   * position based on 100% zoom.
   */
  position: Vector2;
  size: Bounds | null;
};
export type RoomBackgroundState = {
  // FIXME: this could be simplified if we stopped treating our
  // provided backgrounds as special and just referred to them by URL.
  backgroundName: string;
  customBackgroundUrl?: string;
};

/**
 * The main state slice for a Room, containing all data important to rendering
 * a Room
 */
interface RoomState {
  widgets: Record<string, WidgetState>;
  people: Record<string, PersonState>;
  /** Position data is keyed on the id of the widget or participant */
  positions: Record<string, ObjectPositionData>;
  bounds: Bounds;
  background: RoomBackgroundState;
  useSpatialAudio: boolean;
}

/** Use for testing only, please. */
export const initialState: RoomState = {
  positions: {},
  widgets: {},
  people: {},
  // TODO: make this changeable
  bounds: {
    width: 2500,
    height: 2500,
  },
  background: {
    backgroundName: BackgroundName.Bg1,
  },
  useSpatialAudio: true,
};

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    /** adds a widget at the specified position */
    addWidget: {
      // the user is not required to provide an id for a new widget;
      // it will be generated for them in the action preparation step.
      prepare(input: { position: Vector2; size?: Bounds; widget: Omit<WidgetState, 'id'> }) {
        return {
          payload: {
            ...input,
            widget: {
              id: nanoid(),
              ...input.widget,
            } as WidgetState,
          },
        };
      },
      reducer(
        state,
        {
          payload,
        }: PayloadAction<{
          position: Vector2;
          size?: Bounds;
          widget: WidgetState;
        }>
      ) {
        state.positions[payload.widget.id] = {
          position: payload.position,
          size: payload.size || null,
        };

        state.widgets[payload.widget.id] = payload.widget;
      },
    },
    /** adds a person at the specified position */
    addPerson(
      state,
      {
        payload,
      }: PayloadAction<{
        position: Vector2;
        person: PersonState;
      }>
    ) {
      state.positions[payload.person.id] = {
        position: payload.position,
        // always auto-size people
        size: null,
      };

      state.people[payload.person.id] = payload.person;
    },
    removeWidget(state, { payload }: PayloadAction<{ id: string }>) {
      delete state.widgets[payload.id];
      delete state.positions[payload.id];
    },
    removePerson(state, { payload }: PayloadAction<{ id: string }>) {
      delete state.people[payload.id];
      delete state.positions[payload.id];
    },
    /** Updates the position of any object in the room by ID */
    moveObject(state, { payload }: PayloadAction<{ id: string; position: Vector2 }>) {
      if (!state.positions[payload.id]) return;
      // restrict the position to the bounds of the room
      const clamped = {
        x: clamp(payload.position.x, -state.bounds.width / 2, state.bounds.width / 2),
        y: clamp(payload.position.y, -state.bounds.height / 2, state.bounds.height / 2),
      };
      state.positions[payload.id].position = clamped;
    },
    resizeObject(state, { payload }: PayloadAction<{ id: string; size: Bounds | null }>) {
      if (!state.positions[payload.id]) return;
      const clamped = payload.size
        ? {
            width: clamp(payload.size.width, MIN_WIDGET_WIDTH, Infinity),
            height: clamp(payload.size.height, MIN_WIDGET_HEIGHT, Infinity),
          }
        : null;
      state.positions[payload.id].size = clamped;
    },
    /** Updates the data associated with a widget */
    updateWidgetData(state, { payload }: PayloadAction<{ id: string; data: Partial<WidgetData>; publish?: boolean }>) {
      if (!state.widgets[payload.id]) return;
      state.widgets[payload.id].data = {
        ...state.widgets[payload.id].data,
        ...payload.data,
      };
      // if publish is true and we're already a draft,
      // publish it!
      if (payload.publish && state.widgets[payload.id].isDraft) {
        state.widgets[payload.id].isDraft = false;
        if (state.positions[payload.id]) {
          // also trigger a remeasure on publish, since content will probably
          // change
          state.positions[payload.id].size = null;
        }
      }
    },
    /** Changes the emoji displayed for a participant */
    updatePersonEmoji(state, { payload }: PayloadAction<{ id: string; emoji: EmojiData | string | null }>) {
      if (!state.people[payload.id]) return;
      state.people[payload.id].emoji = payload.emoji;
    },
    /** Changes the avatar displayed for a participant */
    updatePersonAvatar(state, { payload }: PayloadAction<{ id: string; avatar: string }>) {
      if (!state.people[payload.id]) return;
      state.people[payload.id].avatar = payload.avatar;
    },
    /** Changes the speaking state of a participant */
    updatePersonIsSpeaking(state, { payload }: PayloadAction<{ id: string; isSpeaking: boolean }>) {
      if (!state.people[payload.id]) return;
      state.people[payload.id].isSpeaking = payload.isSpeaking;
    },
    updateRoomBackground(state, { payload }: PayloadAction<RoomBackgroundState>) {
      state.background = payload;
    },
    updatePersonScreenViewSid(state, { payload }: PayloadAction<{ id: string; screenViewSid: string }>) {
      const person = state.people[payload.id];
      if (!person) return;

      person.viewingScreenSid = payload.screenViewSid;
    },
  },
});

export const { actions, reducer } = roomSlice;

export const selectors = {
  createPositionSelector: (objectId: string) => (state: RootState) => state.room.positions[objectId]?.position || null,
  selectWidgetIds: (state: RootState) => Object.keys(state.room.widgets),
  createWidgetSelector: (widgetId: string) => (state: RootState) => state.room.widgets[widgetId] || null,
  selectPeopleIds: (state: RootState) => Object.keys(state.room.people),
  createPersonSelector: (participantId: string) => (state: RootState) => state.room.people[participantId] || null,
  selectRoomBounds: (state: RootState) => state.room.bounds,
  selectHasWhiteboard: (state: RootState) =>
    Object.values(state.room.widgets).some((widget) => widget.type === WidgetType.Whiteboard),
  selectBackground: (state: RootState) => state.room.background,
  createEmojiSelector: (personId: string) => (state: RootState) => state.room.people[personId]?.emoji,
  selectUseSpatialAudio: (state: RootState) => state.room.useSpatialAudio,
  createPersonAvatarSelector: (personId: string) => (state: RootState) => state.room.people[personId]?.avatar,
  createPersonScreenViewSidSelector: (personId: string) => (state: RootState) =>
    state.room.people[personId]?.viewingScreenSid,
  createPersonIsSpeakingSelector: (personId: string) => (state: RootState) => state.room.people[personId]?.isSpeaking,
};
