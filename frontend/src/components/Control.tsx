import React, { Component, ReactNode } from "react";
import { WithStyles, createStyles, withStyles, Paper } from "@material-ui/core";
import PlaybackItem from "./spotify/PlaybackItem";
import { IControlController, ControlState } from "../interfaces/controllers/ControlController";
import PlayArrowIcon from "@material-ui/icons/PlayArrow"
import PauseIcon from "@material-ui/icons/Pause"
import SkipNextIcon from "@material-ui/icons/SkipNext"
import SkipPrevIcon from "@material-ui/icons/SkipPrevious"
import { Slider } from "@material-ui/lab";
import { observer } from "mobx-react";

const styles = createStyles({
    container: {
        display: "flex",
        justifyContent: "center",
        padding: "5px 15px"
    },
    currentPlaybackContainer: {
        marginRight: "auto"
    },
    playbackIcon: {
        height: "100%",
        display: "block",
    },
    controlsContainer: {
        display: "flex"
    },
    volumeContainer: {
        width: "200px",
        display: "flex",
        alignItems: "center",
        marginLeft: "auto"
    },
    slider: {
        padding: "25px",
        overflow: "hidden"
    }
});

interface IProps {
    controller: IControlController
}

@observer
class Control extends Component<WithStyles<typeof styles> & IProps> {

    public render() : ReactNode {

        const { controller, classes } = this.props;
        const playing = controller.currentlyPlaying;

        let playbackIcon = <PlayArrowIcon className={classes.playbackIcon} />
        if(controller.state === ControlState.PLAYING) {
            playbackIcon = <PauseIcon className={classes.playbackIcon} />
        }

        const onVolumeChange = (event: React.ChangeEvent<{}>, value: number) => {
            controller.onVolumeChange(value)
        }

        return (
            <Paper className={classes.container}>
                <div className={classes.currentPlaybackContainer}>
                    <PlaybackItem title={playing.name}
                        subtitle={playing.artistName}
                        albumArtUrl={playing.albumUrl}/>
                </div>
               

                <div className={classes.controlsContainer}>
                    <SkipPrevIcon className={classes.playbackIcon} />
                    {playbackIcon}
                    <SkipNextIcon className={classes.playbackIcon} />
                </div>

                <div className={classes.volumeContainer}>
                    <Slider value={controller.volume} 
                        className={classes.slider}
                        onChange={onVolumeChange}/>
                </div>
            </Paper>
        )
    }

}

export default withStyles(styles)(Control)