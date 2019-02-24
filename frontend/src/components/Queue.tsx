import React, { Component, ReactNode } from "react";
import { createStyles, WithStyles, withStyles, ListItem, List } from "@material-ui/core";
import { IQueuedSong } from "../interfaces/services/QueueService";
import Song from "./Song";

interface IProps {
    queued: IQueuedSong[]
}

const styles = createStyles({
    container: {
        width: "100%"
    },
    listItem: {
        padding: "0"
    }
});

class Queue extends Component<WithStyles<typeof styles> & IProps> {

    public render() : ReactNode {
        const classes = this.props.classes;

        const queuedItems = this.props.queued.map((queueItem, index) => {
            return (
                <ListItem key={index} className={classes.listItem}>
                    <Song song={queueItem}/>
                </ListItem>
            )
        })

        return (
            <List className={classes.container}>
                {queuedItems}
            </List>
        )
    }
}

export default withStyles(styles)(Queue);