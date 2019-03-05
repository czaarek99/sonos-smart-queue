import React, { Component, ReactNode } from "react";
import { createStyles, WithStyles, withStyles, Typography } from "@material-ui/core";
import AlbumArt from "./AlbumArt";

const ALBUM_SIZE = 50;
const HALF_SIZE = ALBUM_SIZE / 2;

const styles = createStyles({
    container: {
        height: "100%",
        display: "grid",
        gridTemplateRows: `${HALF_SIZE}px ${HALF_SIZE}px`,
        gridTemplateColumns: `${ALBUM_SIZE}px auto`,
        alignItems: "center",
        columnGap: "10px",
        margin: "5px"
    },
    albumContainer: {
        gridColumn: "1",
        gridRow: "span 2",
        overflow: "hidden",
        maxHeight: `${ALBUM_SIZE}px`,
        maxWidth: `${ALBUM_SIZE}px`
    },
    title: {
        gridColumn: "2",
        gridRow: "1",
        fontSize: "17px",
        textOverflow: "ellipsis",
        overflow: "hidden",
        whiteSpace: "nowrap"
    },
    subtitle: {
        gridColumn: "2",
        gridRow: "2"
    },
})

interface IProps {
    title: string,
    albumArtUrl: string,
    subtitle: string
}

class PlaybackItem extends Component<WithStyles<typeof styles> & IProps> {

    public render() : ReactNode {
        const classes = this.props.classes;
        const { title, subtitle, albumArtUrl } = this.props;

        return (
            <div className={classes.container}>
                <div className={classes.albumContainer}>
                    <AlbumArt imgSrc={albumArtUrl} />
                </div>
                <Typography className={classes.title}>
                    {title}
                </Typography>
                <Typography className={classes.subtitle}>
                    {subtitle}
                </Typography>
            </div>
        )
    }

}

export default withStyles(styles)(PlaybackItem);