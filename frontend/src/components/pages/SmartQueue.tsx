import { observer } from "mobx-react";
import React, { Component, ReactNode } from "react";
import { createStyles, WithStyles } from "@material-ui/core";

const styles = createStyles({
    container: {
        display: "grid",
        gridTemplateColumns: "200px auto",
        gridTemplateRows: "auto auto",
        gridTemplateAreas: `
            "nav nav"
            "queue browse"
        `
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

            </div>
        )
    }

}