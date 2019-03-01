import React, { Component, ReactNode } from "react";
import { Input, Button, withStyles, createStyles, WithStyles, FormHelperText, TextField, Paper, Theme } from "@material-ui/core";
import { ILoginController } from "../../interfaces/controllers/LoginController";
import { observer } from "mobx-react";


const styles = (theme: Theme) => createStyles({
    container: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%"
    },
    authInput: {
        margin: "5px"
    },
    authButton: {
        margin: "5px"
    },
    errorMessage: {
        padding: "10px",
        backgroundColor: theme.palette.error.main,
        margin: "5px",
        width: "100%"
    },
    buttonContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }
});

interface IProps {
    controller: ILoginController
}

@observer
class Login extends Component<WithStyles<typeof styles> & IProps> {

    public render() : ReactNode {
        const { controller, classes } = this.props;
        const hasError = controller.error ? true : false;

        let errorMessage = null;
        if(hasError) {
            errorMessage = (
                <Paper className={classes.errorMessage}>
                    <p>{controller.error}</p>
                </Paper>
            )
        }

        return (
            <div className={classes.container}>
                <div>
                    <TextField className={classes.authInput} 
                        onChange={(event) => { controller.onChange("username", event.target.value)}}
                        value={controller.model.username}
                        error={hasError}
                        label="Username"
                        required={true} 
                        disabled={controller.loading}
                        fullWidth={true} />
                    <TextField className={classes.authInput}
                        onChange={(event) => { controller.onChange("password", event.target.value)}}
                        value={controller.model.password}
                        error={hasError}
                        label="Password"
                        required={true}
                        disabled={controller.loading}
                        fullWidth={true} />

                    {errorMessage}

                    <div className={classes.buttonContainer}>
                        <Button className={classes.authButton} 
                            color="primary" 
                            disabled={controller.loading}
                            onClick={() => controller.onLogin()}>

                            Log in
                        </Button>
                        <Button className={classes.authButton} 
                            disabled={controller.loading}
                            color="primary" 
                            onClick={() => controller.onRegister()}>

                            Register
                        </Button>
                    </div>
                </div>
            </div>
        )
    }
}

export default withStyles(styles)(Login);