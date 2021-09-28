import React,{ useState,useEffect} from 'react';
import { Container, AppBar, Typography, Grow, Grid } from '@material-ui/core'
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import useStyles from './styles';
import Auth from './components/Auth/Auth';

const App=()=>{
    return(
    <BrowserRouter>
        <Container maxidth='lg'>
            <Navbar />
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/auth" exact component={Auth} />
            </Switch>
        </Container>
    </BrowserRouter>
    )
}

export default App;