import * as React from 'react';
import { Box, makeStyles, Paper } from '@material-ui/core';
import { Omnibar } from './omnibar/Omnibar';
import { MediaControls } from './media/MediaControls';
import { SettingsButton } from './settings/SettingsButton';
import { RoomMenu } from './roomMenu/RoomMenu';

export interface IRoomControlsProps {}

const useStyles = makeStyles((theme) => ({
  mainControls: {
    position: 'fixed',
    left: theme.spacing(2),
    top: theme.spacing(2),
    zIndex: theme.zIndex.speedDial,
    borderRadius: 16,
    padding: theme.spacing(1.5),
  },
  settingsButton: {
    marginLeft: theme.spacing(1),
  },
  roomMenu: {
    position: 'fixed',
    right: theme.spacing(2),
    top: theme.spacing(2),
    borderRadius: 16,
    padding: theme.spacing(1.5),
  },
}));

export const RoomControls = React.memo<IRoomControlsProps>((props) => {
  const classes = useStyles();

  return (
    <>
      <Box component={Paper} className={classes.mainControls} display="flex" flexDirection="row" alignItems="center">
        <Omnibar />
        <MediaControls />
        <SettingsButton className={classes.settingsButton} />
      </Box>
      <Box component={Paper} className={classes.roomMenu}>
        <RoomMenu />
      </Box>
    </>
  );
});
