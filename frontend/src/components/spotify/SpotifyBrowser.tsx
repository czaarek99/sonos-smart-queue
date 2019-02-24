import React, { Component, ReactNode } from "react";
import { Paper, Typography, Button, createStyles } from "@material-ui/core";

const styles = createStyles({

});

class SpotifyBrowser extends Component {

    public render() : ReactNode {
        return (
            <div>
                <Paper>
                    <Typography>
                        Please click the button below to link your spotify account.
                    </Typography>
                    <Button color="primary">
                        Link
                    </Button>
                </Paper>
            </div>
        )
    }

}

export default SpotifyBrowser;