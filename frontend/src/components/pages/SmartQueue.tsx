import { observer } from "mobx-react";
import React, { Component, ReactNode } from "react";
import { createStyles, WithStyles, withStyles } from "@material-ui/core";
import QueueItem from "../../QueueItem";
import Navbar from "../Navbar";

const styles = createStyles({
    container: {
        display: "grid",
        gridTemplateColumns: "200px auto",
        gridTemplateRows: "min-content auto",
        gridTemplateAreas: `
            "nav nav"
            "queue browse"
        `,
        height: "100%"
    },
    queue: {
        gridArea: "queue"
    },
    nav: {
        gridArea: "nav",
    }
})

interface IProps {

}

@observer
class SmartQueue extends Component<WithStyles<typeof styles> & IProps> {

    render() : ReactNode {
        const { classes } = this.props;

        return (
            <div className={classes.container}>
                <div className={classes.nav}>
                    <Navbar />
                </div>
                <div className={classes.queue}>
                    <QueueItem artistName="random artist" songName="good song" albumUrl="/album.png"/>
                </div>
            </div>
        )
    }

}

export default withStyles(styles)(SmartQueue);