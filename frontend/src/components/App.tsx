import React, { Component, ReactNode } from 'react';
import Login from './pages/Login';
import { CssBaseline, MuiThemeProvider, createStyles, withStyles, WithStyles } from '@material-ui/core';
import theme from '../theme';
import JssProvider from 'react-jss/lib/JssProvider';
import "typeface-roboto";
import { LoginController } from '../controllers/LoginController';
import { AuthenticationService } from '../services/AuthenticationService';
import { Provider, inject, observer } from 'mobx-react';
import { RootStore } from '../stores/RootStore';
import SmartQueue from './pages/SmartQueue';
import { SmartQueueController } from '../controllers/SmartQueueController';
import { SpotifyBrowserController } from '../controllers/SpotifyBrowserController';
import { IAppController } from '../interfaces/controllers/AppController';
import { IRootStore } from '../interfaces/stores/RootStore';
import { AppController } from '../controllers/AppController';
import { observable } from 'mobx';

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

interface IProps {}

@observer
class App extends Component<IProps & WithStyles<typeof styles>> {

    @observable private readonly controller: IAppController;
    private readonly rootStore: IRootStore;

    constructor(props) {
        super(props);

        this.rootStore = new RootStore();
        this.controller = new AppController(this.rootStore);
    }

	render() : ReactNode {
		let content = null;

		if(this.controller.loggedIn) {
            content = (
                <SmartQueue controller={new SmartQueueController(this.rootStore)} 
                    browserController={new SpotifyBrowserController(this.rootStore)}/>
            )
		} else {
			content = <Login controller={new LoginController(this.rootStore, this.controller)}/>;
		}

		return (
			<Provider rootStore={this.rootStore}>
				<MuiThemeProvider theme={theme}>
					<CssBaseline />
                    {content}
				</MuiThemeProvider>
			</Provider>
		)
	}
}

export default withStyles(styles)(App);
