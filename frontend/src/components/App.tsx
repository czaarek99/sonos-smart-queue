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
import { GroupChooserController } from '../controllers/GroupChooserController';

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
	@observable private smartQueueController: SmartQueueController;
	@observable private controlController: ControlController;
	@observable private groupChooserController: GroupChooserController;
	@observable private spotifyBrowserController: SpotifyBrowserController;

	constructor(props) {
		super(props);
		this.controller = new AppController();
		this.smartQueueController = new SmartQueueController(this.controller);
		this.controlController = new ControlController(this.controller);
		this.groupChooserController = new GroupChooserController(this.controller);
		this.spotifyBrowserController = new SpotifyBrowserController(this.controller);
	}

	render() : ReactNode {
		let content = null;

		if(this.controller.loggedIn) {
			content = (
				<SmartQueue controller={this.smartQueueController}
					controlController={this.controlController}
					groupChooserController={this.groupChooserController}
					browserController={this.spotifyBrowserController}/>
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
