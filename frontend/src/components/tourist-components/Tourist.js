import React, { Component } from 'react'
import Moment from 'moment';

import { Alert, Table, Button, ListGroup } from 'react-bootstrap';

export class Tourist extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: this.props.match.params.id,
            tourist: {},
            flights: [],
        }
    }

    componentDidMount() {
        fetch(`/users/${this.state.id}`)
            .then(res => res.json())
            .then(json => {
                this.setState({
                    tourist: json,
                    flights: json.flights
                })
            });
    }

    delete = e => {
        this.props.clear()

        fetch(`/flights/remove/${e.target.parentElement.id}/${this.props.match.params.id}`, {method: 'put'})
            .then(async res => {
                if(res.status == 200) {
                    this.props.alert(['Trip has been removed'])
                    this.componentDidMount();
                } 
                else if(res.status == 400){
                    res = await res.json()
                    this.props.alert(null, res)
                }
            })
    } 

    reserve = e => {
        this.props.clear()

        this.props.history.push({
            pathname: '/reserve',
            state: { 
                mode : 0,
                tourist_id: e.target.id,
                flight_id: 0 
            }
        })
    }

    render() {
        const {tourist, flights} = this.state

        return(
            <div>
                <Table striped bordered hover>
                    <tbody>
                        <tr>
                            <th>Name</th>
                            <td>{tourist.name}</td>
                        </tr>
                        <tr>
                            <th>Lastname</th>
                            <td>{tourist.lastname}</td>
                        </tr>
                        <tr>
                            <th>Sex</th>
                            <td>{tourist.sex}</td>
                        </tr>
                        <tr>
                            <th>Country</th>
                            <td>{tourist.country}</td>
                        </tr>
                        <tr>
                            <th>Birth</th>
                            <td>{Moment(tourist.birth).format('D-MM-YYYY')}</td>
                        </tr>
                        <tr>
                            <th>Flights</th>
                            <td>
                                <ListGroup variant="flush">
                                    {flights.length != 0 ? (
                                        flights.map((f, i) => 
                                        <ListGroup.Item key={i}>
                                            <div id={f._id}>
                                                from {Moment(f.departure).format('D-MM-YYYY HH:mm')} to {Moment(f.arrival).format('D-MM-YYYY HH:mm')}
                                                <Button 
                                                    id="users" 
                                                    variant="danger" 
                                                    className="float-right" 
                                                    onClick={this.delete.bind(this)}>Delete</Button>
                                            </div>
                                        </ListGroup.Item>
                                        )
                                    ) : (
                                        <p>No flights yet</p>
                                    )}
                                    <ListGroup.Item key="secret_id">
                                        <Button 
                                            id={tourist._id}
                                            variant="success" 
                                            onClick={this.reserve.bind(this)}>Reserve new trip</Button>
                                    </ListGroup.Item>
                                </ListGroup>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </div>
        )
    }
}

export default Tourist
