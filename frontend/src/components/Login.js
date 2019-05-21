import React, { Component } from 'react'
import { Form, Button } from 'react-bootstrap';
import axios, {setToken} from "../services/axios";

export class Login extends Component {
    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);

        this.state = {
            username: "",
            password: "",
        }
    }

    submit(e) {
        e.preventDefault();
        this.props.clear();

        let data = this.state

        console.log(data)

        // fetch('/users/login', {
        //     method: 'post',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data)
        // })
        // .then(async res => {
        //     if (res.status == 400) {
        //         this.props.alert(null, ['Wrong username or password'])
        //     }
        //     else if (res.status == 200) {
        //         this.props.alert(['Logged in'])
        //         res = await res.json()
        //         console.log(res.token)
        //         localStorage.setItem('token', res.token);
        //         // this.props.history.push('/');
        //     }
        // })

        axios.post('/users/login', null, data)
            .then((res) => {
                
                if (res.status == 400) {
                    this.props.alert(null, ['Wrong username or password'])
                }
                else if (res.status == 200) {
                    this.props.alert(['Logged in'])
                    localStorage.setItem('user-token', res.data.token)
                    this.props.history.push('/');
                    // window.location.reload();
                }

            })
    }

    render() {
        return (
            <div>
                <Form onSubmit={e => this.submit(e)}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Username</Form.Label>
                        <Form.Control ref="username" type="text" placeholder="Enter login" onChange={e => this.setState({ username: e.target.value })} required/>
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control ref="password" type="password" placeholder="Password" onChange={e => this.setState({ password: e.target.value })} required/>
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Log in
                    </Button>
                </Form>
            </div>
        )
    }
}

export default Login
