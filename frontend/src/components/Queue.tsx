import React, { Component, ReactNode } from "react";
import { createStyles, WithStyles, withStyles } from "@material-ui/core";
import { IQueuedSong } from "../interfaces/services/QueueService";
import QueueItem from "./QueueItem";

interface IProps {
    queued: IQueuedSong[]
}

const styles = createStyles({
    container: {
        width: "100%"
    }
});

class Queue extends Component<WithStyles<typeof styles> & IProps> {

    public render() : ReactNode {
        const classes = this.props.classes;

        const queuedItems = this.props.queued.map((queueItem, index) => {
            return (
                <QueueItem song={queueItem} key={index} />
            )
        })

        return (
            <div className={classes.container}>
                {queuedItems}
            </div>
        )
    }
}

export default withStyles(styles)(Queue);