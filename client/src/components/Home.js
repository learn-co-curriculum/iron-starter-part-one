import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div style={{ marginTop: '32px', padding: '16px' }}>
            <h1>Welcome To Iron Starter</h1>
            <p>Find exciting campaigns to fund, start a campaign for something you are passionate about, or just browse around and see what new intersting ideas people have.</p>
            <p>Click <Link to='/campaigns'>here</Link> to see the available campaigns to support</p>
        </div>
    )
}

export default Home;