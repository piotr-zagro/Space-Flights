import React, { Component } from 'react'
import Moment from 'moment';
import axios from "../services/axios";

import { Table, Button } from 'react-bootstrap';

export class Home extends Component {
    constructor(props) {
        super(props)
        this.state = {
            tourists: [],
            flights: [],
        };
    }

    componentDidMount() {
        this.fetchTourists()
        this.fetchFlights()
    }

    fetchTourists = () => {
        // fetch('/users')
        //     .then(res => res.json())
        //     .then(json => {
        //         this.setState({
        //             tourists: json
        //         })
        //         console.log(json)
        //     });

        // axios.interceptors.request.use(config => {
        //     config.headers.post['authorization'] = 'value';
        //     return config;
        // });

        axios.get('/users')
            .then((response) => {
                this.setState({tourists: response.data});
            })
            .catch((error) => {
                // handle errors - i.e notifications
            })
    }

    fetchFlights = () => {
        axios.get('/flights')
            .then((response) => {
                this.setState({flights: response.data});
            })
            .catch((error) => {
                // handle errors - i.e notifications
            })
    }

    delete = e => {
        this.props.clear()

        const {id} = e.target
        const uri = `/${e.target.id}/${e.target.parentElement.parentElement.id}`

        fetch(uri, {
            method: 'delete',
        })
        .then(res => {
            if(res.status == 204) {
                this.props.alert(['Removal complete'])
                this.componentDidMount();
                
                if(id == 'flights') this.fetchFlights()
                this.fetchTourists()
            }
        })
    } 

    more = e => {
        this.props.clear()

        const url = `/${e.target.id}/${e.target.parentElement.parentElement.id}`
        this.props.history.push(url)
    }

    render() {
        const { tourists, flights } = this.state;

        return (
            <div>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>Id</th>
                        <th>Name</th>
                        <th>Lastname</th>
                        <th>Sex</th>
                        <th>Country</th>
                        <th>Birth</th>
                        <th></th>
                        <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {tourists.map((t, i) =>
                        <tr key={t._id} id={t._id}>
                            <th>{i}</th>
                            <td> {t.name} </td>
                            <td> {t.lastname} </td>
                            <td> {t.sex} </td>
                            <td> {t.country} </td>
                            <td>{Moment(t.birth).format('D-MM-YYYY')}</td>
                            <td><Button id="users" variant="info" onClick={this.more.bind(this)}>More</Button></td>
                            <td><Button id="users" variant="danger" onClick={this.delete.bind(this)}>Delete</Button></td>
                        </tr>
                        )}
                    </tbody>
                </Table>
                <br/>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                        <th>Id</th>
                        <th>Departure</th>
                        <th>Arrival</th>
                        <th>Seats</th>
                        <th>Price</th>
                        <th></th>
                        <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {flights.map((f, i) =>
                        <tr key={f._id} id={f._id}>
                            <th>{i}</th>
                            <td>{Moment(f.departure).format('D-MM-YYYY HH:mm')}</td>
                            <td>{Moment(f.arrival).format('D-MM-YYYY HH:mm')}</td>
                            <td> {f.tourists.length} / {f.seats} </td>
                            <td>
                                {new Intl.NumberFormat('de-DE', { 
                                    style: 'currency', 
                                    currency: 'EUR',
                                    minimumFractionDigits: 0, 
                                    maximumFractionDigits: 0 
                                }).format(f.price)}
                            </td>
                            <td><Button id="flights" variant="info" onClick={this.more.bind(this)}>More</Button></td>
                            <td><Button id="flights" variant="danger" onClick={this.delete.bind(this)}>Delete</Button></td>
                        </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        )
    }
}

export default Home
