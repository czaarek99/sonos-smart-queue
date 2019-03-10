import React, { Component, ReactNode } from "react";
import { WithStyles, createStyles, withStyles, Paper } from "@material-ui/core";
import Heading from "./Heading";

const styles = createStyles({
    container: {
        display: "grid",
        gridTemplateRows: "min-content 1fr",
        width: "100%",
        height: "100%",
        minHeight: "0",
        "& > *": {
            minHeight: "0"
        }
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
                <div>
                    {this.props.children}
                </div>
            </Paper>
        )
    }

}

export default withStyles(styles)(Section);