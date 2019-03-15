import React, { Component, ReactNode } from "react";
import { WithStyles, withStyles, createStyles } from "@material-ui/core";

interface IProps {
	imgSrc: string,
}

const styles = createStyles({
	img: {
		height: "100%",
		width: "100%"
	}
});

class AlbumArt extends Component<WithStyles<typeof styles> & IProps> {

	public render() : ReactNode {
		return (
			<img src={this.props.imgSrc} className={this.props.classes.img}/>
		)
	}
}

export default withStyles(styles)(AlbumArt);