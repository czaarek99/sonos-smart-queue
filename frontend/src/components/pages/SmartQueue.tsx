import { observer } from "mobx-react";
import React, { Component, ReactNode } from "react";
import { createStyles, WithStyles, withStyles, Theme } from "@material-ui/core";
import PlaybackItem from "../spotify/PlaybackItem";
import Navbar from "../Navbar";
import Queue from "../Queue";
import { ISmartQueueController } from "../../interfaces/controllers/SmartQueueController";
import GroupChooser from "../GroupChooser";
import SpotifyBrowser from "../spotify/SpotifyBrowser";
import { ISpotifyBrowserController } from "../../interfaces/controllers/SpotifyBrowserController";

const GRID_GAP = "10px";

const styles = (theme: Theme) => createStyles({
    container: {
        display: "grid",
        gridTemplateColumns: "min-content min-content auto",
        gridTemplateRows: "min-content auto",
        gridTemplateAreas: `
            "nav nav nav"
            "groups queue browse"
        `,
        height: "100%",
        gridGap: GRID_GAP,
        paddingBottom: GRID_GAP,
    },
    queue: {
        gridArea: "queue",
    },
    nav: {
        gridArea: "nav",
    },
    groups: {
        gridArea: "groups",
        marginLeft: GRID_GAP
    },
    browse: {
        maxHeight: "inherit",
        gridArea: "browse",
        marginRight: GRID_GAP,
    }
})

interface IProps {
    controller: ISmartQueueController,
    browserController: ISpotifyBrowserController
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
                    <SpotifyBrowser controller={this.props.browserController}/>
                </div>
            </div>
        )
    }

}

export default withStyles(styles)(SmartQueue);