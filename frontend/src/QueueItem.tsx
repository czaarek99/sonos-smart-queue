import React, { Component, ReactNode } from "react";
import { ListItem } from "@material-ui/core";

export interface IQueueItem {
    songName: string
    albumName: string
    songLength: string
    albumUrl: string
}

interface IProps extends IQueueItem {}

class QueueItem extends Component {

    public render() : ReactNode {
        return (
            <ListItem>
                
            </ListItem>
        )
    }

}