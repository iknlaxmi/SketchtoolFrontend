import React, { useState, Component } from 'react';
// import ReactCanvasPaint from 'react-canvas-paint';
import 'react-canvas-paint/dist/index.css';
import CanvasDraw from 'react-canvas-draw';
import '../Styles/sketch.css';

export default class UserDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: '',
      data: [],
      savedData: [],
    };
    this.canvasRef = React.createRef(null);
    this.canvasRef1 = React.createRef(null);
    this.onDone = this.onDone.bind(this);
    this.onLoad = this.onLoad.bind(this);
  }
  componentDidMount() {
    fetch('http://localhost:5000/userData', {
      method: 'POST',
      crossDomain: true,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        token: window.localStorage.getItem('token'),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, 'userData');
        this.setState({ userData: data.data });
      });
  }

  onDone(e) {
    this.state.data = this.canvasRef.current.getSaveData();
    // alert(this.state.data);
    e.preventDefault();
    let sketch = this.state.data;
    console.log(sketch + 'sketch');
    fetch('http://localhost:5000/sketch', {
      method: 'POST',
      crossDomain: true,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        sketch,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data + 'sketch data');
        if (data.status == 'ok') {
          alert('data saved');
          console.log(data.data);
        }
      });
  }
  onLoad() {
    console.log(this.state.data);
    console.log(this.state.userData.sketch);
    let val = this.canvasRef1.current.loadSaveData(
      this.state.userData.sketch,
      true
    );
  }
  render() {
    return (
      <div className="container">
        <div className="user-details">
          <div className="user-details-item">
            <p>
              {this.state.userData.fname}
              {this.state.userData.lname}
            </p>
          </div>
        </div>

        <CanvasDraw
          ref={this.canvasRef}
          brushColor="rgba(255,0,0,1)"
          brushRadius={2}
          hideInterface={true}
          // lazyRadius={0}
          // imgSrc="http://placehold.it/120x120&text=image4"
          canvasHeight={250}
          canvasWidth={350}
        />
        <button onClick={this.onDone}>Save</button>

        <CanvasDraw
          ref={this.canvasRef1}
          brushColor="rgba(255,0,0,1)"
          brushRadius={2}
          hideInterface={true}
          // lazyRadius={0}
          // imgSrc="http://placehold.it/120x120&text=image4"
          canvasHeight={250}
          canvasWidth={350}
        />
        <button onClick={this.onLoad}>Load</button>
      </div>
    );
  }
}
