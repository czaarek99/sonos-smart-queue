import { createMuiTheme } from "@material-ui/core";

const palette = {
	primary: {
		main: "#1DB954",
	},
	secondary: {
		main: "#FFFFFF"
	},
}

export default createMuiTheme({
	palette,
	typography: {
		useNextVariants: true
	}
});
