import './App.css';
import React from 'react';
import fetch from 'isomorphic-fetch';
import album from './models/album';

export class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      albums: [],
      isLoaded: false,
      apiUri: 'https://8000-jfelipefloress-iwaca2-yr08gqwm006.ws-eu44.gitpod.io/albums'
    };

  }

  componentDidMount() {
    this.fetchFromApi();
  }

  fetchFromApi() {
    fetch(this.state.apiUri)
      .then((res) => {
        return res.text();
      })
      .then((albumsRes) => {
        let jsonRes = JSON.parse(albumsRes);
        //.sort((a, b) => a.position - b.position)
        if (Object.keys(jsonRes.length) === 0) return;

        this.setState({
          albums: jsonRes,
          isLoaded: true
        })
      });
  }

  addAlbum(e) {
    
    e.preventDefault();
    const {albums } = this.state;
    const newAlbum = {
      number: parseInt(this.number.value) + 1,
      artist: this.artist.value,
      title: this.title.value,
      year: this.year.value
    };

    this.setState({
      albums: [...this.state.albums, newAlbum]
    })

    var albumMongoose = new album({
      number: newAlbum.number,
      year: newAlbum.year,
      title: newAlbum.title,
      artist: newAlbum.artist
    })

    fetch(this.state.apiUri, {
      method: 'post',
      body: albumMongoose
    }).then((res) => {
      console.log(res);
    });
  }

  render() {
    return (
      <div className="row">
        <div className="table-container col-sm">
          <div id="albumsTable">
            <table>
              <thead>
                <tr id='album-list-head'>
                  <th>Position</th>
                  <th>Title</th>
                  <th>Year</th>
                  <th>Artist</th>
                  <th> </th>
                </tr>
              </thead>

              <tbody id='albums-body'>
                {AlbumRows(this.state['albums'])}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-sm-2">

          <form id='append-form' onSubmit={(e) => { this.addAlbum(e) }} width='100%'
            method="dialog" className="form-inline">
            <h4>Add new album:</h4>
            <label htmlFor="position">Position:</label>
            <input type="number" name="position" min="1" max="500" defaultValue="1" className="form-control" ref={(value) => {this.number = value;}}/>

            <label htmlFor="title">Title:</label>
            <input type="text" name="title" placeholder="title" className="form-control" required ref={(value) => {this.title = value;}}/>

            <label htmlFor="year">Year:</label>
            <input type="number" name="year" min="1900" max="2022" defaultValue="2021" className="form-control" required ref={(value) => {this.year = value;}}/>

            <label htmlFor="artist">Artist:</label>
            <input type="text" name="artist" placeholder="artist" className="form-control" required ref={(value) => {this.artist = value;}}/>
            <br />

            <button type="submit" className="btn btn-primary" id="append">
              add album
            </button>

          </form>

        </div>
      </div>
    );
  };

};

function AlbumRows(albums) {

  if (Object.keys(albums).length === 0) return;

  var tds = [];

  for (let i = 0; i < albums.length; i++) {
    const albumData = albums[i];
    tds.push(
      <tr className="album-row" id="album-row" draggable="true" key={albumData.number}>
        <td className='number' id='number'>{albumData.number}</td>
        <td className='title'>{albumData.title}</td>
        <td className='year'>{albumData.year}</td>
        <td className='artist'>{albumData.artist}</td>
        <td><button className='btn btn-danger' id="delete-button">delete</button></td>
      </tr>
    );
  }
  return tds;
}

function AppendElement() {
  var inputs = null;
  if (!isValidFormInputs(inputs)) {
    return
  }

  var newAlbum = new album({
    number: inputs.item(0).value,
    year: inputs.item(2).value,
    title: inputs.item(1).value,
    artist: inputs.item(3).value
  });

  var albumRow = albumRow(newAlbum);
  React.AddAlbumToList(newAlbum);

  /**
  var allAlbums = TableBody.albums;
  // Places the item in the first position available if greater than the current amount of albums.
  if (inputs.item(0).value > allAlbums.length + 1) {
          inputs.item(0).value = allAlbums.length + 1;
  }*/

  //var albumListBody = document.getElementById('albums-body');
  //albumListBody.appendChild(newAlbumRow);
}

/**
 * Checks for validity of inputs from user.
 *
 * @param {NodeList} inputs append-form inputs
        * @returns true if valid, false if not
        */
function isValidFormInputs(inputs) {
  try {
    inputs.forEach(input => {
      input.value = input.value.trim();

      // Checks if inputs are not empty
      if (input.value === '') {
        /*badNotification({
            title: 'Error',
            message: 'Please fill in all fields!'
        });*/
        return false;
      }

      // Checks if position is valid (between 1 and 500)
      if (input.getAttribute('name') === 'position' && (input.value < 1 || input.value > 500)) {
        /*badNotification({
            title: 'Error',
            message: 'Only positions from 1 to 500 allowed!'
        });*/
        return false;
      }

      // Checks if year is valid (between 1900 and 2022)
      if (input.getAttribute('name') === 'year' && (input.value < 1900 || input.value > 2022)) {
        /*badNotification({
            title: 'Error',
            message: 'Only albums from 1900 to 2022 allowed!'
        });*/
        return false;
      }
    });

    return true;

  } catch (e) { // try catch created to break from forEach loop
    return false;
  }
}