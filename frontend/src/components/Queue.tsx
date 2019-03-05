import React, { Component, ReactNode } from "react";
import { createStyles, WithStyles, withStyles, ListItem, List, Typography, Paper } from "@material-ui/core";
import { IQueuedSong } from "../interfaces/services/QueueService";
import PlaybackItem from "./spotify/PlaybackItem";
import Heading from "./Heading";
import Section from "./Section";

interface IProps {
    queued: IQueuedSong[]
}

const styles = createStyles({
    listItem: {
        padding: "0"
    },
    queueText: {
        width: "270px",
        textAlign: "center"
    }
});

class Queue extends Component<WithStyles<typeof styles> & IProps> {

    public render() : ReactNode {
        const classes = this.props.classes;

        const queuedItems = this.props.queued.map((queueItem, index) => {
            return (
                <ListItem key={index} className={classes.listItem}>
                    <PlaybackItem albumArtUrl={queueItem.albumArtUrl}
                        title={queueItem.name}
                        subtitle={queueItem.artistName}/>
                </ListItem>
            )
        });

        let content = null;
        if(queuedItems.length > 0) {
            content = (
                <List disablePadding={true}>
                    {queuedItems}
                </List>
            )
        } else {
            content = (
                <Typography className={classes.queueText}>
                    Queue is empty!
                </Typography>
            )
        }

        return (
            <Section header="Queue">
                {content}
            </Section>
        )
    }
}

export default withStyles(styles)(Queue);