import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Campaigns from './containers/Campaigns';
import { appStyle, brandButtonStyle, headerStyle, navButtonStyle } from './styles';

class App extends Component {
    render() {
        return (
            <Router>
                <div style={appStyle}>
                    <div style={headerStyle}>
                        <Link to="/"><button style={brandButtonStyle}>Iron Starter</button></Link>
                        <Link to="/campaigns"><button style={navButtonStyle}>Campaigns</button></Link>
                        <Link to="/campaigns/new"><button style={navButtonStyle}>Create Campaign</button></Link>
                    </div>
                    <div>
                        <Route exact path="/" component={Home} />
                        <Route path="/campaigns" component={Campaigns} />
                    </div>
                </div>
            </Router>
        );
    }
}

export default App;
