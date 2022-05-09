import logo from './logo.svg';
import './App.css';
import React from 'react';

export class App extends React.Component  {
  
  static name;

 constructor(props) {
  super(props);
  this.name = "testing it out";

 }
  render() {
    return (
      <div className="App">
          <table>
            <tr>
              <th>
                test it
              </th>
            </tr>
            <tr>
              <td>
                {this.name}
              </td>
            </tr>
          </table>
      </div>
    );
  };
};

export default App;