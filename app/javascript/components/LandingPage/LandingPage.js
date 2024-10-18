import React, {Component, Fragment} from "react"
import Home from './components/pages/Home'
import Layout from './layout/Layout'
import Header from './components/misc/Header'


class LandingPage extends Component {
    constructor(props) {
        super(props);

        this.state = {

        }
    }

    render() {
        return React.createElement(
            Fragment,
            null,
            React.createElement(Header, null),
            React.createElement(
            "div",
            { className: "body-wrap" },
            React.createElement(
                Layout,
                null,
                React.createElement(Home, null)
            )
            )
        );
    }
}

export default LandingPage