import './App.css';
import React from 'react';
import fetch from 'isomorphic-fetch';
import mongoose from 'mongoose';
import Popup from 'reactjs-popup';

export class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      albums: [],
      dragItem: null,
      isLoaded: false,
      apiUri: 'https://8000-jfelipefloress-iwaca2-gllkcucnmzs.ws-eu45.gitpod.io/albums'
    };

  }

  /**
   * Fetch albums from DB when component is mounted
   */
  componentDidMount() {
    this.fetchFromApi();
  }

  /**
   * Fetch albums from API
   */
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

  setAlbums(newAlbums) {
    this.setState({
      albums: newAlbums
    });
  }

  setDragItem(item) {
    this.setState({
      dragItem: item,
    });
  }

  /**
   * Add album to DB and react list
   * @param {ClickEvent} e mouse click
   */
   addAlbum(e) {
    
    e.preventDefault();

    /*if (!isValidFormInputs(e)) {
      console.log('Invalid input');
      return;
    }*/

    const newAlbum = {
      _id: new mongoose.Types.ObjectId(),
      number: parseInt(this.number.value),
      artist: this.artist.value,
      title: this.title.value,
      year: parseInt(this.year.value)
    };

    this.setState({
      albums: [...this.state.albums, newAlbum]
    })

    var albumMongoose =JSON.stringify(newAlbum);
    
    fetch(this.state.apiUri, {
      method: 'POST',
      headers: {"Content-type": "application/json; charset=UTF-8"},
      body: albumMongoose
    })
    .then(response => response.json())
    .then(json => console.log(json))
    .catch(error => console.log("Error: ", error));

    e.target.reset();
  }

  /**
   * Delete album from DB and react list
   * @param {clickEvent} e mouse click
   */
  deleteAlbum(e) {
    e.preventDefault();
    const splitString = e.target.value.split(',');
    const pos = splitString[0];
    const id = splitString[1];
    console.log(pos);
    console.log(id);
    fetch(this.state.apiUri + '/' + id,{
      method: 'DELETE'
    })
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(err => console.log("Error: ", err));

    let updatedAlbums = this.state.albums;
    updatedAlbums.splice(pos, 1);
    this.setState({
      albums: updatedAlbums
    })

  }

  updateAlbum(e) {
    const id = e.target.value;
    console.log(id);
    
  }

  /**
   * Render class App
   * @returns list of albums
   */
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
                {AlbumRows(this, this.state['albums'])}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-sm-2">

          <form id='append-form' onSubmit={(e) => { this.addAlbum(e) }} width='100%'
            method="dialog" className="form-inline">
            <h4>Add new album:</h4>
            <label htmlFor="position">Position:</label>
            {/*<input type="number" name="position" min="1" max="500" defaultValue="1" className="form-control" ref={(value) => {this.number = value;}}/>*/}
            <input type="number" name="position" defaultValue="501" className="form-control" ref={(value) => {this.number = value;}}/>

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

/**
 * Draw trs of albums
 * @param {JSON} albums JSON list of albums
 * @returns table rows of albums
 */
function AlbumRows(app, albums) {

  if (Object.keys(albums).length === 0) return;

  albums = albums.sort((a, b) => a.number - b.number);

  var tds = [];

  for (let i = 0; i < albums.length; i++) {
    const albumData = albums[i];
    tds.push(
      <tr className="album-row" id="album-row" draggable="true" key={albumData._id}  onChange={(e) => app.updateAlbum(e)}>
        <td className='number' id='number'>{albumData.number}</td>
        <td className='title'>{albumData.title}</td>
        <td className='year'>{albumData.year}</td>
        <td className='artist'>{albumData.artist}</td>
        <td><button className='btn btn-danger' id="delete-button" value={[i, albumData._id]} onClick={(e)=> app.deleteAlbum(e)}>delete</button></td>
        {EditPopUp(i, albumData, app)}
      </tr>
    );
  }
  return tds;
}

function EditPopUp(i, albumData, app) {
  return (
    <Popup position="left center" trigger={<td><button className='btn btn-warning' id="delete-button" value={[i, albumData._id, albumData.number, albumData.title, albumData.year, albumData.artist]} onClick={(e)=> app.updateAlbum(e)}>edit</button></td>}>
      <div style={{"backgroundColor": "(255, 255, 255)", "padding": "10%", "width": "100vh"}}>
        <h1>FUNCIONOU</h1>
      </div>
    </Popup>
  );
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

