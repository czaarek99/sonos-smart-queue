import React, { Component, ReactNode } from "react";
import { ListItem, createStyles, WithStyles, withStyles } from "@material-ui/core";
import Album from "./components/Album";

export interface IQueueItem {
    artistName: string
    songName: string
    albumUrl: string
}

const ALBUM_SIZE = 70;
const HALF_SIZE = ALBUM_SIZE / 2;

const styles = createStyles({
    listItem: {
        padding: "0"
    },
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

interface IProps extends IQueueItem {}

class QueueItem extends Component<WithStyles<typeof styles> & IProps> {

    public render() : ReactNode {
        const classes = this.props.classes;

        return (
            <ListItem className={classes.listItem}>
                <div className={classes.container}>
                    <div className={classes.albumContainer}>
                        <Album imgSrc={this.props.albumUrl} />
                    </div>
                    <p className={classes.songName}>
                        {this.props.songName}
                    </p>
                    <p className={classes.artistName}>
                        {this.props.artistName}
                    </p>
                </div>

            </ListItem>
        )
    }

}

export default withStyles(styles)(QueueItem);