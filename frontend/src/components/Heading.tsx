import React, { Component, ReactNode } from "react";
import { WithStyles, createStyles, withStyles, Typography } from "@material-ui/core";

const styles = createStyles({
    heading: {
        textAlign: "center",
        paddingBottom: "10px",
        paddingTop: "10px"
    }
});

interface IProps {
    text: string
}

class Heading extends Component<WithStyles<typeof styles> & IProps> {

    public render() : ReactNode {
        return (
            <Typography variant="h6" className={this.props.classes.heading}>
                {this.props.text}
            </Typography>
        )
    }

}

export default withStyles(styles)(Heading);