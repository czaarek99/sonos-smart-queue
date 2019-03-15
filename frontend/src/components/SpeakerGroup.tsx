import React, { Component, ReactNode } from "react";
import { Divider, Typography, createStyles, FormHelperText, WithStyles, withStyles, Theme, Paper, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import SpeakerGroupIcon from '@material-ui/icons/SpeakerGroup';
import SpeakerIcon from '@material-ui/icons/Speaker';

const styles = (theme: Theme) => createStyles({
	container: {
		margin: "13px",
		width: "220px"
	},
	nested: {
		paddingLeft: theme.spacing.unit * 4
	},
	text: {
		textOverflow: "ellipsis",
		overflow: "hidden",
		whiteSpace: "nowrap",
	}
});

interface IProps {
	groupName: string
	speakerNames: string[]
}

class SpeakerGroup extends Component<WithStyles<typeof styles> & IProps> {

	public render() : ReactNode {
		const classes = this.props.classes;

		const speakers = this.props.speakerNames.map((name, index) => {
			return (
				<ListItem key={index} className={classes.nested}>
					<ListItemIcon>
						<SpeakerIcon />
					</ListItemIcon>
					<Typography noWrap={true} className={classes.text} >
						{name}
					</Typography>
				</ListItem>
			)
		});

		return (
			<List className={classes.container}>
				<ListItem>
					<ListItemIcon>
						<SpeakerGroupIcon />
					</ListItemIcon>
					<Typography className={classes.text}>
						{this.props.groupName}
					</Typography>
				</ListItem>
				<List disablePadding={true}>
					{speakers}
				</List>
			</List>
		)
	}
}

export default withStyles(styles)(SpeakerGroup);