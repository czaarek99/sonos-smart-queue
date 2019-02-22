import React, { Component, ReactNode } from 'react';
import Login from './pages/Login';
import { CssBaseline, MuiThemeProvider, createStyles, withStyles, WithStyles } from '@material-ui/core';
import theme from '../theme';
import JssProvider from 'react-jss/lib/JssProvider';
import "typeface-roboto";
import { LoginController } from '../controllers/LoginController';
import { AuthenticationService } from '../services/AuthenticationService';
import { Provider, inject } from 'mobx-react';
import { RootStore } from '../stores/RootStore';

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

class App extends Component {

	render() : ReactNode {
		const rootStore = new RootStore();

		let content = null;

		if(rootStore.authenticationStore.isLoggedIn()) {

		} else {
			content = <Login controller={new LoginController(rootStore)}/>;
		}

		return (
			<Provider rootStore={rootStore}>
				<MuiThemeProvider theme={theme}>
					<CssBaseline />
				</MuiThemeProvider>
			</Provider>
		)
	}
}

export default withStyles(styles)(App);
