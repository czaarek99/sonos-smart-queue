import React, { Component, ReactNode } from "react";
import { ListItem, createStyles, WithStyles, withStyles, Typography } from "@material-ui/core";
import Album from "./Album";
import { IQueuedSong } from "../interfaces/services/QueueService";

const ALBUM_SIZE = 70;
const HALF_SIZE = ALBUM_SIZE / 2;

const styles = createStyles({
    container: {
        height: "100%",
        display: "grid",
        gridTemplateRows: `${HALF_SIZE}px ${HALF_SIZE}px`,
        gridTemplateColumns: `${ALBUM_SIZE}px 200px`,
        alignItems: "center",
        columnGap: "10px",
        margin: "5px"
    },
    albumContainer: {
        gridColumn: "1",
        gridRow: "span 2"
    },
    songName: {
        gridColumn: "2",
        gridRow: "1"
    },
    artistName: {
        gridColumn: "2",
        gridRow: "2"
    },
})

interface IProps {
    song: IQueuedSong
}

class Song extends Component<WithStyles<typeof styles> & IProps> {

    public render() : ReactNode {
        const classes = this.props.classes;
        const { albumArtUrl, name, artistName } = this.props.song;

        return (
            <div className={classes.container}>
                <div className={classes.albumContainer}>
                    <Album imgSrc={albumArtUrl} />
                </div>
                <Typography className={classes.songName}>
                    {name}
                </Typography>
                <Typography className={classes.artistName}>
                    {artistName}
                </Typography>
            </div>
        )
    }

}

export default withStyles(styles)(Song);