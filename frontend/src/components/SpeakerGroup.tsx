import React, { Component, ReactNode } from "react";
import { Divider, Typography, createStyles, FormHelperText, WithStyles, withStyles, Theme } from "@material-ui/core";
import SpeakerGroupIcon from '@material-ui/icons/SpeakerGroup';
import SpeakerIcon from '@material-ui/icons/Speaker';

const styles = (theme: Theme) => createStyles({
    container: {
        minWidth: "200px",
        border: `2px solid ${theme.palette.primary.main}`,
        borderRadius: "2px"
    },
    speaker: {
        display: "flex",
        padding: "5px"
    },
    group: {
        display: "flex",
        padding: "5px"
    }
})

interface IProps {
    groupName: string,
    speakerNames: string[]
}

class SpeakerGroup extends Component<WithStyles<typeof styles> & IProps> {

    public render() : ReactNode {
        const classes = this.props.classes;

        const speakers = this.props.speakerNames.map((name, index) => {
            return (
                <div className={classes.speaker} key={index}>
                    <SpeakerIcon />
                    <Typography>{name}</Typography>
                </div>
            )
        })

        return (
            <div className={classes.container}>
                <div className={classes.group}>
                    <SpeakerGroupIcon />
                    <Typography variant="subtitle1">
                        {this.props.groupName}
                    </Typography>
                </div>
                <Divider />
                {speakers}
            </div>
        )
    }
}

export default withStyles(styles)(SpeakerGroup);