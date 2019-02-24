import React, { Component, ReactNode } from "react";
import { WithStyles, createStyles, withStyles, Paper } from "@material-ui/core";
import Heading from "./Heading";

const styles = createStyles({
    container: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column"
    },
    children: {
        flexGrow: 1
    }
});

interface IProps {
    header: string
}

class Section extends Component<WithStyles<typeof styles> & IProps> {

    public render() : ReactNode {
        const { header, classes } = this.props;

        return (
            <Paper className={classes.container}>
                <Heading text={header}/>
                <div className={classes.children}>
                    {this.props.children}
                </div>
            </Paper>
        )
    }

}

export default withStyles(styles)(Section);