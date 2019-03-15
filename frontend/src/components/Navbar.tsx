import { WithStyles, createStyles, withStyles, Theme, AppBar, Toolbar, IconButton, Typography } from "@material-ui/core";
import React, { Component, ReactNode } from "react";
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { INavbarController } from "../interfaces/controllers/NavbarController";

const styles = (theme: Theme) => createStyles({
	menuButton: {
		marginLeft: -12,
		marginRight: 20, 
	},
	grow: {
		flexGrow: 1
	}
})

interface IProps {
	//controller: INavbarController
}

//TODO: Implement menu
//https://material-ui.com/api/app-bar/

class Navbar extends Component<WithStyles<typeof styles>> {

	public render() : ReactNode {
		const { classes } = this.props;
		
		return (
			<AppBar position="static">
				<Toolbar>
					<IconButton className={classes.menuButton}>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" color="inherit" className={classes.grow}>
						Sonos Smart Queue
					</Typography>
					<div>
						<IconButton color="inherit">
							<AccountCircle />
						</IconButton>
					</div>
				</Toolbar>
			</AppBar>
		)
	}

}

export default withStyles(styles)(Navbar);