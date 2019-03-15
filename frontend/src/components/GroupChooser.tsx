import React, { Component, ReactNode } from "react";
import { createStyles, ListItem, List, Typography, WithStyles, withStyles, Paper } from "@material-ui/core";
import { ISpeakerGroup } from "../interfaces/services/InfoService";
import SpeakerGroup from "./SpeakerGroup";
import Section from "./Section";
import { IGroupChooserController } from "../interfaces/controllers/GroupChooserController";

const styles = createStyles({
	heading: {
		textAlign: "center",
		paddingBottom: "10px"
	},
	list: {
		height: "100%",
		overflow: "scroll"
	},
	speakerGroup: {
		cursor: "pointer",
		padding: "0"
	},
});

interface IProps {
	controller: IGroupChooserController
}

class GroupChooser extends Component<WithStyles<typeof styles> & IProps> {

	public render() : ReactNode {
		const { classes, controller } = this.props;

		const groups = controller.groups.map((group, index) => {
			const names = group.speakers.map((speaker) => {
				return speaker.name;
			});

			const onClick = () => {
				controller.onSelect(group.id)
			};

			return (
				<ListItem onClick={onClick} 
					disableGutters={true} 
					key={group.id}
					selected={controller.selectedId === group.id}
					className={classes.speakerGroup}>

					<SpeakerGroup groupName={"Group " + index} speakerNames={names} />
				</ListItem>
			)
		});

		return (
			<Section header="Group Selection" loading={controller.loading}>
				<List disablePadding={true} className={classes.list}>
					{groups}
				</List>
			</Section>
		)
	}
}

export default withStyles(styles)(GroupChooser);