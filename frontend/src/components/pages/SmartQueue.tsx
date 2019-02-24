import { observer } from "mobx-react";
import React, { Component, ReactNode } from "react";
import { createStyles, WithStyles, withStyles, Theme } from "@material-ui/core";
import Song from "../Song";
import Navbar from "../Navbar";
import Queue from "../Queue";
import { ISmartQueueController } from "../../interfaces/controllers/SmartQueueController";
import GroupChooser from "../GroupChooser";
import SpotifyBrowser from "../spotify/SpotifyBrowser";

const styles = (theme: Theme) => createStyles({
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
        gridArea: "queue",
        borderLeft: `2px solid ${theme.palette.primary.main}`,
    },
    nav: {
        gridArea: "nav",
    },
    groups: {
        gridArea: "groups"
    },
    browse: {
        gridArea: "browse"
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
                    <GroupChooser groups={controller.speakerGroups} onSelect={() => {}}/>
                </div>
                <div className={classes.browse}>
                    <SpotifyBrowser />
                </div>
            </div>
        )
    }

}

export default withStyles(styles)(SmartQueue);