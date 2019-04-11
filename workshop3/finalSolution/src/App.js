import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ComputerVision from './components/computervision';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header id="title">
          <h1>Computer Vision API Demo</h1>
        </header>
        <div id="subtitle">Analyze an image with the Azure Computer Vision API and Custom Vision</div>
        <ComputerVision/>
      </div>
    );
  }
}

export default App;
