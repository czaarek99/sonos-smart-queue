import React, { Component, ReactNode } from "react";
import { createStyles, ListItem, List, Typography, WithStyles, withStyles, Paper } from "@material-ui/core";
import { ISpeakerGroup } from "../interfaces/services/InfoService";
import SpeakerGroup from "./SpeakerGroup";
import Section from "./Section";
import { IGroupChooserController } from "../interfaces/controllers/GroupChooserController";
import { observer } from "mobx-react";

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

@observer
class GroupChooser extends Component<WithStyles<typeof styles> & IProps> {

	public render() : ReactNode {
		const { classes, controller } = this.props;

		const groups = controller.groups.map((group, index) => {
			const names = [];

			for(const speaker of group.speakers) {
				const speakerName = speaker.name;

				if(!names.includes(speakerName)) {
					names.push(speakerName);
				}
			}

			const onClick = () => {
				controller.onSelect(group.id)
			};

			return (
				<ListItem onClick={onClick}
					disableGutters={true}
					key={group.id}
					selected={controller.selectedId === group.id}
					className={classes.speakerGroup}>

					<SpeakerGroup speakerNames={names} />
				</ListItem>
			)
		});

		return (
			<Section header="Group Selection">
				<List disablePadding={true} className={classes.list}>
					{groups}
				</List>
			</Section>
		)
	}
}

export default withStyles(styles)(GroupChooser);