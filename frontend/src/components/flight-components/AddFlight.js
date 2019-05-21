import React, { Component } from 'react'
import { Alert, Form, Button, Col } from 'react-bootstrap';

export class AddFlight extends Component {
    constructor(props) {
        super(props);
        this.submit = this.submit.bind(this);

        this.state = {
            departure: "",
            arrival: "",
            seats: "",
            price: "",
        }
    }

    submit(e) {
        e.preventDefault();
        this.props.clear()

        let data = this.state

        fetch('/flights', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then(async res => {
                if (res.status == 400) {
                    res = await res.json()
                    this.props.alert(null, res)
                }
                else if (res.status == 201) {
                    this.props.alert(['Flight has been created'])
                    this.props.history.push('/');
                }
            })
    }

    render() {
        const { departure, arrival, seats, price } = this.state

        return (
            <div>
                <Form onSubmit={e => this.submit(e)}>
                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridDeparture">
                            <Form.Label>Departure</Form.Label>
                            <Form.Control ref="departue" type="datetime-local" onChange={e => this.setState({ departure: e.target.value })} required />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridDeparture">
                            <Form.Label>Arrival</Form.Label>
                            <Form.Control ref="arrival" type="datetime-local" onChange={e => this.setState({ arrival: e.target.value })} required />
                        </Form.Group>
                    </Form.Row>

                    <Form.Row>
                        <Form.Group as={Col} controlId="formGridSex">
                            <Form.Label>Seats</Form.Label>
                            <Form.Control ref="seats" type="number" value={seats} min="1" onChange={e => this.setState({ seats: e.target.value })} required />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridCountry">
                            <Form.Label>Price</Form.Label>
                            <Form.Control ref="price" type="number" value={price} min="1" onChange={e => this.setState({ price: e.target.value })} required />
                        </Form.Group>
                    </Form.Row>

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </div>
        )
    }
}

export default AddFlight
