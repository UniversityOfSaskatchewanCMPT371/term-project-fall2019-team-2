import React, {Component} from 'react';
import {Route} from 'react-router';
import {Layout} from './components/Layout';
import {Home} from './components/Home';
import {FetchData} from './components/FetchData';
import {Counter} from './components/Counter';
import {OccurrenceData} from './components/OccurrenceData';
import {Timeline} from './components/Timeline';
import {d3test} from './components/d3test';
import {CanvasTest} from "./components/CanvasTest";
import {D3Timeline} from "./components/D3Timeline";
import 'bootstrap/dist/css/bootstrap.css';

//import './custom.css'

export default class App extends Component {
    static displayName = App.name;

    render() {
        return (
            <Layout>
                <Route exact path='/' component={Home}/>
                <Route path='/counter' component={Counter}/>
                <Route path='/fetch-data' component={FetchData}/>
                <Route path='/OccurrenceData' component={OccurrenceData}/>
                <Route path='/Timeline' component={Timeline}/>
                <Route path='/d3test' component={d3test}/>
                <Route path='/CanvasTest' component={CanvasTest}/>
                <Route path='/D3Timeline' component={D3Timeline}/>
            </Layout>
        );
    }
}