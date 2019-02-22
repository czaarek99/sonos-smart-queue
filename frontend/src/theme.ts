import { createMuiTheme } from "@material-ui/core";

const palette = {
    primary: {
        main: "#1DB954",
    },
    secondary: {
        main: "#FFFFFF"
    },
    background: {
        default: "#FFFFFF"
    }
}

export default createMuiTheme({
    palette,
    overrides: {
        MuiButton: {
            root: {
                backgroundColor: palette.primary.main,
            },
        }
    }
    
});
