import React, { Component } from 'react';
import './App.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import Box from './components/Box';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Box />
      </div>
    );
  }
}

export default App;
