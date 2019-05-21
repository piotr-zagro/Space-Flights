import React, { Component } from 'react'
import { Alert, Form, Button, Col } from 'react-bootstrap';

export class AddTourist extends Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);

    this.state = {
      name: "",
      lastname: "",
      sex: "",
      country: "",
      birth: "",
    }
  }

  submit(e) {
    e.preventDefault();
    this.props.clear()

    let data = this.state

    fetch('/users', {
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
          res = await res.json()
          this.props.alert([`Tourist ${res.name} ${res.lastname} has been created`])
          this.props.history.push('/')
        }
      })
  }

  render() {
    const { name, lastname, sex, country, birth } = this.state

    return (
      <div>
        <Form onSubmit={e => this.submit(e)}>
          <Form.Row>
            <Form.Group as={Col} controlId="formGridName">
              <Form.Label>Name</Form.Label>
              <Form.Control ref="name" type="text" placeholder="Name" onChange={e => this.setState({ name: e.target.value })} required />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridLastname">
              <Form.Label>Lastname</Form.Label>
              <Form.Control ref="lastname" type="text" placeholder="Lastname" onChange={e => this.setState({ lastname: e.target.value })} required />
            </Form.Group>
          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} controlId="formGridSex">
              <Form.Label>Sex</Form.Label>
              <Form.Control as="select" ref="sex" onChange={e => this.setState({ sex: e.target.value })} required>
                <option value="">...</option>
                <option value="M">M</option>
                <option value="F">F</option>
              </Form.Control>
            </Form.Group>

            <Form.Group as={Col} controlId="formGridCountry">
              <Form.Label>Country</Form.Label>
              <Form.Control ref="country" type="text" value={country} onChange={e => this.setState({ country: e.target.value })} required />
            </Form.Group>

            <Form.Group as={Col} controlId="formGridBirth">
              <Form.Label>Birth</Form.Label>
              <Form.Control ref="birth" type="date" onChange={e => this.setState({ birth: e.target.value })} required />
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

export default AddTourist
