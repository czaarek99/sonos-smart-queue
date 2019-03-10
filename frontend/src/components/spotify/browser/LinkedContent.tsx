import React, { Component, ReactNode } from "react";
import { createStyles, WithStyles, withStyles, ListItem, TextField, List, BottomNavigation, BottomNavigationAction, CircularProgress, LinearProgress, IconButton } from "@material-ui/core";
import { ISpotifyImage } from "../../../interfaces/services/SpotifyService";
import { ISpotifyBrowserController, SearchPage } from "../../../interfaces/controllers/SpotifyBrowserController";
import { QueueItemType } from "../../../interfaces/services/QueueService";
import PlaybackItem from "../PlaybackItem";
import MusicNoteIcon from "@material-ui/icons/MusicNote";
import ViewListIcon from "@material-ui/icons/ViewList";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AlbumIcon from "@material-ui/icons/Album";
import SwipeView from "react-swipeable-views";
import SearchIcon from "@material-ui/icons/Search"
import { observer } from "mobx-react";

const styles = createStyles({
    linkedContent: {
        height: "100%",
        width: "100%",
        display: "grid",
        gridTemplateRows: "min-content 1fr min-content min-content"
    },
    spotifySearch: {
        zIndex: 2,
        width: "100%"
    },
    searchInputContainer: {
        display: "flex"
    },
    resultListItem: {
        padding: 0
    },
    swipe: {
        marginTop: "5px",
        position: "relative"
    },
    resultList: {
        overflow: "scroll",
    },
    progress: {
        height: "6px",
        top: "-2px",
        position: "relative"
    }
});

interface IResultItem {
    id: string,
    title: string
    subtitle: string
    albumArtUrl: string
    onClick?: () => void
}

interface IProps {
    controller: ISpotifyBrowserController
}

@observer
class LinkedContent extends Component<WithStyles<typeof styles> & IProps> {

    public render() : ReactNode {
        const { classes, controller } = this.props;

        const results : IResultItem[] = [];
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
                        albumArtUrl: getArtwork(track.album.images),
                        onClick: () => {
                            controller.onQueue(track.id, QueueItemType.SONG)
                        }
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
                    onClick={result.onClick}
                    key={result.id}
                    selected={false}
                    button={true}>

                    <PlaybackItem {...result}/>
                </ListItem>
            )
        })

        let progress = <div />;
        if(controller.searching) {
            progress = (
                <LinearProgress className={classes.progress} />
            )
        } 

        return (
            <div className={classes.linkedContent}>
                <TextField label="Search spotify"
                    variant="outlined"
                    value={controller.searchQuery}
                    onChange={event => controller.onSearch(event.target.value)}
                    type="search" 
                    className={classes.spotifySearch}/>

                <SwipeView>
                    <List className={classes.resultList}>
                        {listItems}
                    </List>
                </SwipeView>

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
                {progress}
            </div>
        )
    }
}

export default withStyles(styles)(LinkedContent);