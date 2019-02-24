import { observer } from "mobx-react";
import React, { Component, ReactNode } from "react";
import { createStyles, WithStyles, withStyles } from "@material-ui/core";
import QueueItem from "../QueueItem";
import Navbar from "../Navbar";
import Queue from "../Queue";
import { ISmartQueueController } from "../../interfaces/controllers/SmartQueueController";

const styles = createStyles({
    container: {
        display: "grid",
        gridTemplateColumns: "min-content 200px auto",
        gridTemplateRows: "min-content auto",
        gridTemplateAreas: `
            "nav nav nav"
            "groups queue browse"
        `,
        height: "100%"
    },
    queue: {
        gridArea: "queue"
    },
    nav: {
        gridArea: "nav",
    },
    groups: {
        gridArea: "groups"
    }
})

interface IProps {
    controller: ISmartQueueController
}

@observer
class SmartQueue extends Component<WithStyles<typeof styles> & IProps> {

    render() : ReactNode {
        const { classes, controller } = this.props;

        return (
            <div className={classes.container}>
                <div className={classes.nav}>
                    <Navbar />
                </div>
                <div className={classes.queue}>
                    <Queue queued={controller.queueItems}/>
                </div>
                <div className={classes.groups}>

                </div>
            </div>
        )
    }

}

export default withStyles(styles)(SmartQueue);