import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";
import { Alert, Container, Nav, Navbar } from 'react-bootstrap';

import Home from './Home';
import AddTourist from './tourist-components/AddTourist';
import AddFlight from './flight-components/AddFlight';
import Flight from './flight-components/Flight';
import Tourist from './tourist-components/Tourist';
import Reserve from './Reserve';
import Login from './Login';

const PrivateRoute = ({ component: Component, alert, clear, ...rest }) => (
    <Route {...rest} render={(props) => (
        localStorage.getItem('user-token') !== null
            ? <Component alert={alert} clear={clear} {...props}/>
            : <Redirect to="/login" /> )}
    />);

export class Box extends Component {
    constructor(props) {
        super(props)
        this.state = {
            alerts_success: [],
            alerts_error: [],
            isLogged: false
        }

        this.alert = this.alert.bind(this)
        this.clear = this.clear.bind(this)
        this.logout = this.logout.bind(this)
    }

    componentDidMount() {
        if (localStorage.getItem('user-token') !== null) this.setState({ isLogged: true })
    }

    alert(success = null, error = null) {
        let { alerts_success, alerts_error } = this.state
        if (success) alerts_success = [...alerts_success, ...success]
        if (error) alerts_error = [...alerts_error, ...error]
        this.setState({ alerts_success, alerts_error })
    }

    clear() {
        this.setState({
            alerts_success: [],
            alerts_error: []
        })
    }

    logout() {
        this.setState({ isLogged: false })
        localStorage.removeItem('user-token');
        window.location.reload();
    }

    render() {
        const { alerts_success, alerts_error, isLogged } = this.state;

        return (
            <div>
                <Navbar bg="primary" variant="dark">
                    <Navbar.Brand>SpaceY Elon Musketeers</Navbar.Brand>
                    <Nav className="mr-auto">
                        <Nav.Link href="/">List</Nav.Link>
                        {isLogged ? <Nav.Link href="/add_tourist">Add tourist</Nav.Link> : null}
                        {isLogged ? <Nav.Link href="/add_flight">Add flight</Nav.Link> : null}
                        {isLogged ? <Nav.Link onClick={this.logout}>Logout</Nav.Link> : null}
                        
                        {isLogged ? null: <Nav.Link href="/login">Login</Nav.Link>}
                        {isLogged ? null: <Nav.Link href="/register">Register</Nav.Link>}
                    </Nav>
                </Navbar>
                <br />
                <Container>
                    {alerts_success.map((e, i) =>
                        <Alert key={i} variant='success'>{e}</Alert>,
                    )}
                    {alerts_error.map((e, i) =>
                        <Alert key={i} variant='danger'>{e}</Alert>,
                    )}
                    <Router>
                        <div>
                            <PrivateRoute exact path="/reserve" component={Reserve} alert={this.alert} clear={this.clear} />
                            <PrivateRoute exact path="/add_tourist" component={AddTourist} alert={this.alert} clear={this.clear} />
                            {/* <PrivateRoute exact path="/add_flight" render={(props) => <AddFlight alert={this.alert} clear={this.clear} {...props} />} /> */}
                            <PrivateRoute exact path="/add_flight" component={AddFlight} alert={this.alert} clear={this.clear} />
                            <Route exact path="/flights/:id" render={(props) => <Flight alert={this.alert} clear={this.clear} {...props} />} />
                            <Route exact path="/tourists/:id" render={(props) => <Tourist alert={this.alert} clear={this.clear} {...props} />} />
                            <Route exact path="/login" render={(props) => <Login alert={this.alert} clear={this.clear} {...props} />} />
                            <Route exact path="/" render={(props) => <Home alert={this.alert} clear={this.clear} {...props} />} />
                        </div>
                    </Router>
                </Container>
            </div>
        )
    }
}

export default Box
