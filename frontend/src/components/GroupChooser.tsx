import React, { Component, ReactNode } from "react";
import { createStyles, ListItem, List, Typography, WithStyles, withStyles } from "@material-ui/core";
import { ISpeakerGroup } from "../interfaces/services/InfoService";
import SpeakerGroup from "./SpeakerGroup";

const styles = createStyles({
    heading: {
        textAlign: "center",
    },
    container: {
        padding: "10px"
    },
    speakerGroup: {
        cursor: "pointer"
    }
});

interface IProps {
    groups: ISpeakerGroup[],
    onSelect: (id: string) => void
    selectedId?: string,
}

class GroupChooser extends Component<WithStyles<typeof styles> & IProps> {

    public render() : ReactNode {
        const { classes } = this.props;

        const groups = this.props.groups.map((group, index) => {
            const names = group.speakers.map((speaker) => {
                return speaker.name;
            });

            const onClick = () => {
                this.props.onSelect(group.id)
            };

            return (
                <ListItem onClick={onClick} 
                    disableGutters={true} 
                    className={classes.speakerGroup}>

                    <SpeakerGroup groupName={"Group " + index} speakerNames={names} />
                </ListItem>
            )
        });


        return (
            <div className={classes.container} >
                <Typography variant="h6" className={classes.heading}>
                    Group Selection
                </Typography>
                <List disablePadding={true} >
                    {groups}
                </List>
            </div>
        )
    }
}

export default withStyles(styles)(GroupChooser);