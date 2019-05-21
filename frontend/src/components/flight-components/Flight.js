import React, { Component } from 'react'
import Moment from 'moment';

import { Alert, Table, Button, ListGroup } from 'react-bootstrap';

export class Flight extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: this.props.match.params.id,
            flight: {},
            tourists: [],
        }
    }

    componentDidMount() {
        fetch(`/flights/${this.state.id}`)
            .then(res => res.json())
            .then(json => {
                this.setState({
                    flight: json,
                    tourists: json.tourists
                })
            });
    }

    delete = e => {
        this.props.clear()

        fetch(`/flights/remove/${this.props.match.params.id}/${e.target.parentElement.id}`, {method: 'put'})
            .then(async res => {
                if(res.status == 200) {
                    this.props.alert(['Tourist has been removed'])
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
                mode : 1,
                tourist_id: 0,
                flight_id: e.target.id 
            }
        })
    }

    render() {
        const {tourists, flight} = this.state

        return(
            <div>
                <Table striped bordered hover>
                    <tbody>
                        <tr>
                            <th>Departure</th>
                            <td>{Moment(flight.departure).format('D-MM-YYYY HH:mm')}</td>
                        </tr>
                        <tr>
                            <th>Arrival</th>
                            <td>{Moment(flight.arrival).format('D-MM-YYYY HH:mm')}</td>
                        </tr>
                        <tr>
                            <th>Seats</th>
                            <td>{tourists.length} / {flight.seats}</td>
                        </tr>
                        <tr>
                            <th>Price</th>
                            <td>{flight.price}</td>
                        </tr>
                        <tr>
                            <th>Tourists</th>
                            <td>
                                <ListGroup variant="flush">
                                    {tourists.length != 0 ? (
                                        tourists.map((t, i) => 
                                        <ListGroup.Item key={i}>
                                            <div id={t._id}>
                                                {t.name} {t.lastname}
                                                <Button 
                                                    id="flights" 
                                                    variant="danger" 
                                                    className="float-right" 
                                                    onClick={this.delete.bind(this)}>Delete</Button>
                                            </div>
                                        </ListGroup.Item>
                                        )
                                    ) : (
                                        <p>No tourists yet</p>
                                    )}
                                    <ListGroup.Item key="secret_id">
                                        <Button 
                                            id={flight._id}
                                            variant="success" 
                                            onClick={this.reserve.bind(this)}>Add new tourist</Button>
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

export default Flight
