import React, { Component, ReactNode } from 'react';
import Login from './pages/Login';
import { CssBaseline, MuiThemeProvider, createStyles, withStyles } from '@material-ui/core';
import theme from '../theme';
import JssProvider from 'react-jss/lib/JssProvider';
import "typeface-roboto";
import { LoginController } from '../controllers/LoginController';
import { AuthenticationService } from '../services/AuthenticationService';
import { Provider, inject, observer } from 'mobx-react';
import { RootStore } from '../stores/RootStore';
import SmartQueue from './pages/SmartQueue';
import { SmartQueueController } from '../controllers/SmartQueueController';

const styles = createStyles({
	"@global": {
		p: {
			margin: 0
		},
		body: {
			height: "100%"
		},
		html: {
			height: "100%"
		},
		"#root": {
			height: "100%"
		},
		"*": {
			boxSizing: "border-box"
		}
	}
});

@observer
class App extends Component {

	render() : ReactNode {
		const rootStore = new RootStore();

		let content = null;

		if(rootStore.authenticationStore.isLoggedIn()) {
            content = <SmartQueue controller={new SmartQueueController(rootStore)}/>;
		} else {
			content = <Login controller={new LoginController(rootStore)}/>;
		}

		return (
			<Provider rootStore={rootStore}>
				<MuiThemeProvider theme={theme}>
					<CssBaseline />
                    {content}
				</MuiThemeProvider>
			</Provider>
		)
	}
}

export default withStyles(styles)(App);
