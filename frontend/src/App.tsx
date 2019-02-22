import React, { Component } from 'react';
import { Global, css } from "@emotion/core"

const globalStyles = `
	body, html {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}
`;

class App extends Component {
	render() {
		return (
			<React.Fragment>
				<Global styles={css(globalStyles)} />

				<div className="App">
					<p>Test</p>
				</div>
			</React.Fragment>
		);
	}
}

export default App;
