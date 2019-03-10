import React, { Component, ReactNode } from 'react';
import Login from './pages/Login';
import { CssBaseline, MuiThemeProvider, createStyles, withStyles, WithStyles } from '@material-ui/core';
import theme from '../theme';
import JssProvider from 'react-jss/lib/JssProvider';
import "typeface-roboto";
import { LoginController } from '../controllers/LoginController';
import { AuthenticationService } from '../services/AuthenticationService';
import { Provider, inject, observer } from 'mobx-react';
import SmartQueue from './pages/SmartQueue';
import { SmartQueueController } from '../controllers/SmartQueueController';
import { SpotifyBrowserController } from '../controllers/SpotifyBrowserController';
import { AppController } from '../controllers/AppController';
import { observable } from 'mobx';
import { ControlController } from '../controllers/ControlController';

const styles = createStyles({
	"@global": {
		p: {
			margin: 0
		},
		body: {
			height: "100vh"
		},
		html: {
			height: "100vh"
		},
		"#root": {
			height: "100vh"
		},
		"*": {
			boxSizing: "border-box"
		}
	}
});

interface IProps {}

@observer
class App extends Component<IProps & WithStyles<typeof styles>> {

    @observable private readonly controller: AppController;

    constructor(props) {
        super(props);
        this.controller = new AppController();
    }

	render() : ReactNode {
		let content = null;

		if(this.controller.loggedIn) {
            content = (
                <SmartQueue controller={new SmartQueueController(this.controller)} 
                    controlController={new ControlController()}
                    browserController={new SpotifyBrowserController(this.controller)}/>
            )
		} else {
			content = <Login controller={new LoginController(this.controller)}/>;
		}

		return (
            <MuiThemeProvider theme={theme}>
                <CssBaseline />
                {content}
            </MuiThemeProvider>
		)
	}
}

export default withStyles(styles)(App);
