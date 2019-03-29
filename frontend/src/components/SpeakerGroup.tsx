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
	speakerNames: string[]
}

class SpeakerGroup extends Component<WithStyles<typeof styles> & IProps> {

	public render() : ReactNode {
		const classes = this.props.classes;



		let groupName = "";
		const speakerNames = this.props.speakerNames;
		if(speakerNames.length === 1) {
			groupName = speakerNames[0];
		} else if(speakerNames.length > 1) {
			groupName = `${speakerNames[0]} + ${speakerNames.length - 1} more`
		}

		let subSpeakers = null;
		if(speakerNames.length > 1) {
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

			subSpeakers = (
				<List disablePadding={true}>
					{speakers}
				</List>
			)
		}

		return (
			<List className={classes.container}>
				<ListItem>
					<ListItemIcon>
						<SpeakerGroupIcon />
					</ListItemIcon>
					<Typography className={classes.text}>
						{groupName}
					</Typography>
				</ListItem>
				{subSpeakers}
			</List>
		)
	}
}

export default withStyles(styles)(SpeakerGroup);