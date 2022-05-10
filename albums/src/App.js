import './App.css';
import React, { useState, useEffect} from 'react';
import fetch from 'isomorphic-fetch';



export class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      albums: {}
    }
  }

  render() {
    return (
      <table>
        <thead>
          <tr>
            <th>Position</th>
            <th>Title</th>
            <th>Year</th>
            <th>Artist</th>
            <th> </th>
          </tr>
        </thead>

        <tbody id='albums-body'>
          <TableBody />
        </tbody>
      </table>
    );
  };


  
};

function TableBody() {
  const [albums, setAlbums] = useState(null);

  useEffect(() => {
    fetch('https://8000-jfelipefloress-iwaca2-d65r0a2dg4m.ws-eu44.gitpod.io/albums')
    .then((res) => {
      return res.text();
    })
      .then((albumsRes) => {
          setAlbums(JSON.parse(albumsRes));
      });
      
  }, [albums]);

  if (albums == null) return;
  console.log(albums);

  return;
}

export default App;