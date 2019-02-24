import React, { Component, ReactNode } from "react";
import { createStyles } from "@material-ui/core";

const styles = createStyles({
    container: {

    }
});

interface IGroup {
    groupId: string,
    speakers: string[]
}

class GroupChooser extends Component {

    public render() : ReactNode {
        const groupName = "Group X";

        return (
            <div>
            </div>
        )
    }

}