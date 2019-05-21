import React, { Component } from 'react'
import Moment from 'moment';

import { Alert, Table, Button, Form } from 'react-bootstrap';

export class Reserve extends Component {
    constructor(props) {
        super(props)
        this.state = {
            mode: this.props.location.state.mode,
            tourists: [],
            flights: [],
            tourist_id: this.props.location.state.tourist_id,
            flight_id: this.props.location.state.flight_id,
        };
    }

    componentDidMount() {
        const {mode} = this.state
        mode ? this.fetchTourists() : this.fetchFlights()
    }

    finalize = async (e) => {
        this.props.clear()

        const {mode} = this.state

        if(mode) await this.setState({tourist_id: e.target.parentElement.parentElement.id}) 
        else await this.setState({flight_id: e.target.parentElement.parentElement.id})
        
        const {tourist_id, flight_id} = this.state

        fetch(`/flights/add/${flight_id}/${tourist_id}`, {method: 'put'})
            .then(async res => {
                if (res.status == 400) {
                    res = await res.json()
                    this.props.alert(null, res)
                }
                else if (res.status == 200) {
                    const url = mode ? `/flights/${flight_id}` : `/tourists/${tourist_id}`
                    this.props.alert(['Trip reserved'])
                    this.props.history.push(url)
                }
              })
    }

    fetchTourists = () => {
        fetch('/tourists')
            .then(res => res.json())
            .then(json => {
                this.setState({
                    tourists: json
                })
            });
    }

    fetchFlights = () => {
        fetch('/flights')
            .then(res => res.json())
            .then(json => {
                this.setState({
                    flights: json
                })
            });
    }
  
    render() {
        const {mode, tourists, flights} = this.state

        switch (mode) {
            case 1:
                return (
                    <div>
                        <Form>
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
                                    <td>{Moment(t.birth).format('d MMM YYYY')}</td>
                                    <td><Button id="tourist" variant="success" onClick={this.finalize.bind(this)}>Reserve</Button></td>
                                </tr>
                                )}
                            </tbody>
                        </Table>
                        </Form>
                    </div>
                )

            case 0:
                return (
                    <div>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                <th>Id</th>
                                <th>Departure</th>
                                <th>Arrival</th>
                                <th>Seats</th>
                                <th>Price</th>
                                <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {flights.map((f, i) =>
                                <tr key={f._id} id={f._id}>
                                    <th>{i}</th>
                                    <td>{Moment(f.departure).format('d MMM YYYY')}</td>
                                    <td>{Moment(f.arrival).format('d MMM YYYY')}</td>
                                    <td> {f.tourists.length} / {f.seats} </td>
                                    <td>
                                        {new Intl.NumberFormat('de-DE', { 
                                            style: 'currency', 
                                            currency: 'EUR',
                                            minimumFractionDigits: 0, 
                                            maximumFractionDigits: 0 
                                        }).format(f.price)}
                                    </td>
                                    <td><Button id="flight" variant="success" onClick={this.finalize.bind(this)}>Reserve</Button></td>
                                </tr>
                                )}
                            </tbody>
                        </Table>
                    </div>
                )
        }
  }
}

export default Reserve
