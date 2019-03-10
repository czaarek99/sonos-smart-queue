import { observer } from "mobx-react";
import React, { Component, ReactNode } from "react";
import { createStyles, WithStyles, withStyles, Theme } from "@material-ui/core";
import PlaybackItem from "../spotify/PlaybackItem";
import Navbar from "../Navbar";
import Queue from "../Queue";
import { ISmartQueueController } from "../../interfaces/controllers/SmartQueueController";
import GroupChooser from "../GroupChooser";
import SpotifyBrowser from "../spotify/browser/SpotifyBrowser";
import { ISpotifyBrowserController } from "../../interfaces/controllers/SpotifyBrowserController";
import Control from "../Control";
import { IControlController } from "../../interfaces/controllers/ControlController";
import { GroupChooserController } from "../../controllers/GroupChooserController";
import { IGroupChooserController } from "../../interfaces/controllers/GroupChooserController";

const GRID_GAP = "10px";

const styles = (theme: Theme) => createStyles({
    grid: {
        height: "100vh",
        display: "grid",
        gridTemplateColumns: "min-content min-content 1fr",
        gridTemplateRows: "min-content min-content 1fr",
        gridTemplateAreas: `
            "nav nav nav"
            "control control control"
            "groups queue browse"
        `,
        gridGap: GRID_GAP,
        padding: GRID_GAP,
        minHeight: "0",
        "& > *": {
            minHeight: "0"
        }
    },
    nav: {
        gridArea: "nav",
        margin: `-${GRID_GAP} -${GRID_GAP} 0 -${GRID_GAP}`
    },
    queue: {
        gridArea: "queue",
    },
    control: {
        gridArea: "control",
    },
    groups: {
        gridArea: "groups",
    },
    browse: {
        gridArea: "browse",
    }
})

interface IProps {
    controller: ISmartQueueController
    browserController: ISpotifyBrowserController
    controlController: IControlController
    groupChooserController: IGroupChooserController
}

@observer
class SmartQueue extends Component<WithStyles<typeof styles> & IProps> {

    public render() : ReactNode {
        const { classes, controller } = this.props;

        return (
            <div className={classes.grid}>
                <div className={classes.nav}>
                    <Navbar />
                </div>
                <div className={classes.control}>
                    <Control controller={this.props.controlController}/>
                </div>
                <div className={classes.queue}>
                    <Queue queued={controller.queueItems}/>
                </div>
                <div className={classes.groups}>
                    <GroupChooser controller={this.props.groupChooserController}/>
                </div>
                <div className={classes.browse}>
                    <SpotifyBrowser controller={this.props.browserController}/>
                </div>
            </div>
        )
    }

}

export default withStyles(styles)(SmartQueue);