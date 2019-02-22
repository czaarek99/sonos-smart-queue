import React, { Component, ReactNode } from "react";
import { createStyles, WithStyles } from "@material-ui/core";
import { IQueueItem } from "../QueueItem";

interface IProps {
    queued: IQueueItem[]
}

const styles = createStyles({
    container: {}
})

class Queue extends Component<WithStyles<typeof styles> & IProps> {

    public render() : ReactNode {
        const classes = this.props.classes;

        return (
            <div className={classes.container}>
            </div>
        )
    }
}

export default Queue;