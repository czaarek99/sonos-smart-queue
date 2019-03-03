import React, { Component, ReactNode } from "react";
import { Paper, Typography, Button, createStyles, WithStyles, withStyles, CircularProgress, TextField } from "@material-ui/core";
import { ISpotifyBrowserController, BrowserState } from "../../interfaces/controllers/SpotifyBrowserController";
import Section from "../Section";
import { observer } from "mobx-react";
import SearchIcon from "@material-ui/icons/Search";

const styles = createStyles({
    content: {
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "10px"
    },
    linkPaper: {
        padding: "5px",
        textAlign: "center"
    },
    linkedContent: {
        height: "100%",
        width: "100%"
    },
    spotifySearch: {
    },
    searchInputContainer: {
        display: "flex"
    }
});

interface IProps {
    controller: ISpotifyBrowserController    
}

@observer
class SpotifyBrowser extends Component<WithStyles<typeof styles> & IProps> {

    private getLinkedContent() : ReactNode {
        const { classes, controller } = this.props;

        return (
            <div className={classes.linkedContent}>
                <div>
                    <TextField label="Search spotify" type="search" className={classes.spotifySearch}/>
                    <SearchIcon />
                </div>
            </div>
        )
    }

    private getNotLinkedContent() : ReactNode {
        const { classes, controller } = this.props;

        const onClick = () => {
            controller.onLink();
        };

        return (
            <Paper className={classes.linkPaper}>
                <Typography>
                    Please click the button below to link your spotify account.
                </Typography>
                <Button color="primary" onClick={onClick}>
                    Link
                </Button>
            </Paper>
        );
    }

    private getLinkingContent() : ReactNode {
        const { classes, controller } = this.props;

        return (
            <Paper>
                <Typography>
                    Redirecting to spotify for authentication...
                </Typography>
            </Paper>
        )
    }

    public render() : ReactNode {
        const { controller, classes } = this.props;

        let content = null;

        if(controller.loading) {
            content = (
                <CircularProgress size={70}/>
            )
        } else if(controller.state === BrowserState.NOT_LINKED) {
            content = this.getNotLinkedContent();
        } else if(controller.state === BrowserState.LINKING) {
            content = this.getLinkingContent();
        } else if(controller.state === BrowserState.LINKED) {
            content = this.getLinkedContent();
        }

        return (
            <Section header="Spotify">
                <div className={classes.content}>
                    {content}
                </div>
            </Section>
        )
    }

}

export default withStyles(styles)(SpotifyBrowser);