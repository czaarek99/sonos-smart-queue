import React, { Component, ReactNode } from "react";
import { Paper, Typography, Button, createStyles, WithStyles, withStyles, CircularProgress, TextField, List, ListItem, BottomNavigation, BottomNavigationAction } from "@material-ui/core";
import { ISpotifyBrowserController, BrowserState } from "../../interfaces/controllers/SpotifyBrowserController";
import Section from "../Section";
import { observer } from "mobx-react";
import PlaybackItem from "./PlaybackItem";
import MusicNoteIcon from "@material-ui/icons/MusicNote"
import ViewListIcon from "@material-ui/icons/ViewList"
import AccountCircleIcon from "@material-ui/icons/AccountCircle"
import AlbumIcon from "@material-ui/icons/Album"
import { SearchPage } from "../../controllers/SpotifyBrowserController";
import { ISpotifyImage } from "../../interfaces/services/SpotifyService";

const styles = createStyles({
    content: {
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "10px 10px 0 10px"
    },
    linkPaper: {
        padding: "5px",
        textAlign: "center"
    },
    linkedContent: {
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column"
    },
    spotifySearch: {
        width: "100%"
    },
    searchInputContainer: {
        display: "flex"
    },
    resultListItem: {
        padding: 0
    },
    resultList: {
        overflow: "scroll",
        flex: "1 0",
        maxHeight: "100%",
        marginTop: "5px"
    }
});

interface IProps {
    controller: ISpotifyBrowserController    
}

@observer
class SpotifyBrowser extends Component<WithStyles<typeof styles> & IProps> {

    private getLinkedContent() : ReactNode {
        const { classes, controller } = this.props;

        const results = [];
        if(controller.searchResult) {
            const page = controller.selectedNavigation;

            const getArtwork = (images: ISpotifyImage[]) => {
                if(images.length > 0) {
                    return images[0].url;
                } else {
                    return "/album.png";
                }
            }

            if(page === SearchPage.SONGS) {
                for(const track of controller.searchResult.tracks.items) {
                    results.push({
                        id: track.id,
                        title: track.name,
                        subtitle: track.artists[0].name,
                        albumArtUrl: getArtwork(track.album.images)
                    })
                }
            } else if(page === SearchPage.PLAYLISTS) {
                for(const playlist of controller.searchResult.playlists.items) {
                    results.push({
                        id: playlist.id,
                        title: playlist.name,
                        subtitle: `${playlist.tracks.total} songs`,
                        albumArtUrl: getArtwork(playlist.images)
                    })
                }
            } else if(page === SearchPage.ARTISTS) {
                for(const artist of controller.searchResult.artists.items) {
                    results.push({
                        id: artist.id,
                        title: artist.name,
                        subtitle: `${artist.followers.total} followers`,
                        albumArtUrl: getArtwork(artist.images)
                    })
                }
            } else if(page === SearchPage.ALBUMS) {
                for(const album of controller.searchResult.albums.items) {
                    results.push({
                        id: album.id,
                        title: album.name,
                        subtitle: album.release_date,
                        albumArtUrl: getArtwork(album.images)
                    })
                }
            }
        }

        const onNav = (event: React.ChangeEvent<{}>, value: number) => {
            controller.onNavigation(value);
        }

        const listItems = results.map((result) => {
            return (
                <ListItem className={classes.resultListItem}
                    key={result.id}
                    selected={false}
                    button={true}>

                    <PlaybackItem {...result}/>
                </ListItem>
            )
        })

        return (
            <div className={classes.linkedContent}>
                <TextField label="Search spotify"
                    variant="outlined"
                    value={controller.searchQuery}
                    onChange={event => controller.onSearch(event.target.value)}
                    type="search" 
                    className={classes.spotifySearch}/>

                <List className={classes.resultList}>
                    {listItems}
                </List>

                <BottomNavigation showLabels={true} 
                    onChange={onNav} 
                    value={controller.selectedNavigation}>

                    <BottomNavigationAction label="Songs"
                        icon={<MusicNoteIcon />}
                        value={SearchPage.SONGS}/>

                    <BottomNavigationAction label="Playlists" 
                        icon={<ViewListIcon />} 
                        value={SearchPage.PLAYLISTS}/>

                    <BottomNavigationAction label="Artists"
                        icon={<AccountCircleIcon />}
                        value={SearchPage.ARTISTS}/>

                    <BottomNavigationAction label="Albums" 
                        icon={<AlbumIcon />} 
                        value={SearchPage.ALBUMS}/>
                </BottomNavigation>
            </div>
        )
    }

    private getNotLinkedContent() : ReactNode {
        const { classes, controller } = this.props;

        const onClick = () => {
            controller.onLink();
        };

        return (
            <Paper className={classes.linkPaper}>
                <Typography>
                    Please click the button below to link your spotify account.
                </Typography>
                <Button color="primary" onClick={onClick}>
                    Link
                </Button>
            </Paper>
        );
    }

    private getLinkingContent() : ReactNode {
        const { classes, controller } = this.props;

        return (
            <Paper>
                <Typography>
                    Redirecting to spotify for authentication...
                </Typography>
            </Paper>
        )
    }

    public render() : ReactNode {
        const { controller, classes } = this.props;

        let content = null;

        if(controller.loading) {
            content = (
                <CircularProgress size={70}/>
            )
        } else if(controller.state === BrowserState.NOT_LINKED) {
            content = this.getNotLinkedContent();
        } else if(controller.state === BrowserState.LINKING) {
            content = this.getLinkingContent();
        } else if(controller.state === BrowserState.LINKED) {
            content = this.getLinkedContent();
        }

        return (
            <Section header="Spotify">
                <div className={classes.content}>
                    {content}
                </div>
            </Section>
        )
    }

}

export default withStyles(styles)(SpotifyBrowser);