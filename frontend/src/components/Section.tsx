import React, { Component, ReactNode } from "react";
import { WithStyles, createStyles, withStyles, Paper, CircularProgress } from "@material-ui/core";
import Heading from "./Heading";
import { observer } from "mobx-react";

const styles = createStyles({
    container: {
        display: "grid",
        gridTemplateRows: "min-content 1fr",
        width: "100%",
        height: "100%",
        minHeight: "0",
        minWidth: "200px",
        "& > *": {
            minHeight: "0"
        }
    },
    loadingContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    }
});

interface IProps {
    header: string
    loading?: boolean
}

@observer
class Section extends Component<WithStyles<typeof styles> & IProps> {

    public render() : ReactNode {
        const { header, classes } = this.props;

        let content = (
            <div>
                {this.props.children}
            </div>
        );

        if(this.props.loading) {
            content = (
                <div className={classes.loadingContainer}>
                    <CircularProgress size={60}/>
                </div>
            )
        }

        return (
            <Paper className={classes.container}>
                <Heading text={header}/>
                {content}
            </Paper>
        )
    }

}

export default withStyles(styles)(Section);