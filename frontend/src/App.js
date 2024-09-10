import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import PostList from './PostList';

const App = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/posts" element={<PostList />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
