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
      decades: ['All time', '20s', '10s', '00s', '90s', '80s', '70s', '60s', '50s', '40s'],
      currentDecade: 'All time',
      isLoaded: false,
      apiUri: '/albums/'
    };

  }

  /**
   * Fetch albums from DB when component is mounted
   */
  componentDidMount() {
    this.fetchFromApi();
  }

  addAlbumToState(album) {
    if (this.state.albums.length < album.number) album['number'] = this.state.albums.length + 1;

    const position = album.number;
    var sortedAlbums = this.state.albums;

    let currPos = position;

    sortedAlbums.sort((a, b) => a.number - b.number);

    for (let i = 0; i < sortedAlbums.length; i++) {
      const currAlbum = sortedAlbums[i];
      if (currPos == currAlbum.number) {
        console.log("currPos", currPos);
        console.log("curr album number", currAlbum.number);
        currAlbum.number++;
        currPos++;
      };
    }

    sortedAlbums.push(album);

    this.setState({
      albums: sortedAlbums
    })

    var albums = {};

    for (let i = 0; i < this.state.albums.length; i++) {
      const json = this.state.albums[i];
      albums[json._id] = {
        number: json.number,
        year: json.year,
        title: json.title,
        artist: json.artist
      };
    }

    var albumsJSON = JSON.stringify(albums);
    console.log(albumsJSON);

    // update albums
    fetch(this.state.apiUri, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: albumsJSON
    })
      .then(response => response.json())
      .then(json => console.log(json))
      .catch(error => console.log("Error: ", error));

  }

  updateSelectedDecade(e) {
    e.preventDefault();
    this.setState({
      currentDecade: e.target.value
    });
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

    const id = new mongoose.Types.ObjectId();
    let newAlbum = {
      _id: id,
      number: parseInt(this.number.value),
      artist: this.artist.value,
      title: this.title.value,
      year: parseInt(this.year.value)
    };

    this.addAlbumToState(newAlbum);



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

    this.deleteFromDBAndList(id, pos);

  }

  deleteFromDBAndList(id, pos) {

    var sortedAlbums = [...this.state.albums];
    var index = -1;
    for (let i = 0; i < sortedAlbums.length; i++) {
      const newStateAlbum = sortedAlbums[i];
      if (newStateAlbum._id == id) {
        index = i;
      }
    }
    if (index !== -1) sortedAlbums.splice(index, 1);

    let currPos = parseInt(pos) + 1;

    sortedAlbums.sort((a, b) => a.number - b.number);

    for (let i = 0; i < sortedAlbums.length; i++) {
      const currAlbum = sortedAlbums[i];
      if (currPos > parseInt(pos) && currPos < parseInt(currAlbum.number)) {
        currAlbum.number = currPos;
        currPos++;
      };
    }

    this.setState({
      albums: sortedAlbums
    })

    var albums = {};

    for (let i = 0; i < this.state.albums.length; i++) {
      const json = this.state.albums[i];
      albums[json._id] = {
        number: json.number,
        year: json.year,
        title: json.title,
        artist: json.artist
      };
    }

    var albumsJSON = JSON.stringify(albums);

    fetch(this.state.apiUri, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: albumsJSON
    })
      .then(response => response.json())
      .then(json => console.log("updated", json))
      .catch(error => console.log("Error: ", error));

    fetch(this.state.apiUri + id, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(json => console.log("deleted", json))
      .catch(err => console.log("Error: ", err));
  }

  EditPopUp(i) {
    let albumData = this.state.albums[i];
    return (
      <Popup position="left center" trigger={<td><button className='btn btn-warning' id="delete-button">edit</button></td>}>
        <div id="edit-popup" style={{ "backgroundColor": "rgba(125, 125, 125, 0.95)", "width": "50vw", "color": "snow" }}>
          <h1>Edit</h1>
          <form className="form-control" id='edit-form' method='dialog' style={{ "backgroundColor": "rgba(255, 255, 255, 0.5)" }} onSubmit={(e) => {this.updateAlbum(e); document.getElementById('edit-popup').innerHTML = ""}}>
            <label htmlFor="position" className='form-inline'>Position:</label>
            {/*<input type="number" name="position" min="1" max="500" defaultValue={albumData.number} className="form-control"  required />*/}
            <input type="number" name="position" min="1" defaultValue={albumData.number} className="form-control" required />

            <label htmlFor="title">Title:</label>
            <input type="text" name="title" placeholder="title" defaultValue={albumData.title} className="form-control" required />

            <label htmlFor="year">Year:</label>
            <input type="number" name="year" min="1900" max="2022" defaultValue={albumData.year} className="form-control" required />

            <label htmlFor="artist">Artist:</label>
            <input type="text" name="artist" placeholder="artist" defaultValue={albumData.artist} className="form-control" required />
            <br />

            <input name='inputAlbumId' defaultValue={albumData._id} hidden={true} />
            <input name='i' defaultValue={i} hidden={true} />
            <input name='previousNumber' defaultValue={albumData.number} hidden={true} />

            <button type="submit" className="btn btn-primary" id="append" >
              update album
            </button>
          </form>
        </div>
      </Popup>
    );
  }

  updateAlbum(e) {
    e.preventDefault();
    console.log(e.target);
    const elements = e.target.elements;

    const id = new mongoose.Types.ObjectId(elements.inputAlbumId.value);
    const albumJSON = {
      _id: id,
      number: parseInt(elements.position.value),
      artist: elements.artist.value,
      title: elements.title.value,
      year: parseInt(elements.year.value)
    };

    let i = elements.i.value;
    let updatedAlbums = [...this.state.albums];
    updatedAlbums[i] = albumJSON;
    
    this.editAlbumContent(albumJSON);
    if (elements.previousNumber.value != elements.position.value) {
      this.updateAlbumsPosition(elements.position.value, elements.inputAlbumId.value, updatedAlbums)
    } else {
      this.setState({
        albums: updatedAlbums
      })
    }
  }

  editAlbumContent(album) {

    var albumJSON = JSON.stringify(album);

    fetch(this.state.apiUri + album._id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: albumJSON
    })
      .then(response => response.json())
      .then(json => console.log("updated", json))
      .catch(error => console.log("Error: ", error));

  }

  updateAlbumsPosition(pos, id, updatedAlbums) {
    var sortedAlbums = updatedAlbums;
    sortedAlbums.sort((a, b) => a.number - b.number);

    var currPos = pos;

    for (let i = 0; i < sortedAlbums.length; i++) {
      const currAlbum = sortedAlbums[i];
      if (id == currAlbum._id) continue;
      if (currPos == currAlbum.number) {
        currAlbum.number++;
        currPos++;
      };
    }

    this.setState({
      albums: sortedAlbums
    })

    var albums = {};

    for (let i = 0; i < this.state.albums.length; i++) {
      const json = this.state.albums[i];
      albums[json._id] = {
        number: json.number,
        year: json.year,
        title: json.title,
        artist: json.artist
      };
    }

    var albumsJSON = JSON.stringify(albums);
    console.log(albumsJSON);

    // update albums
    fetch(this.state.apiUri, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: albumsJSON
    })
      .then(response => response.json())
      .then(json => console.log(json))
      .catch(error => console.log("Error: ", error));

  }

  /**
   * Render class App
   * @returns list of albums
   */
  render() {
    return (
      <div>
        <div className='row'>

          <div className='select-div col-sm'>
            <label htmlFor="select-year">Show year:</label>
            <select className="select-year form-select"
              name='select-year' style={{ 'minWidth': '100%' }} onChange={e => this.updateSelectedDecade(e)}>
              {this.state.decades.map(decade => {
                return <option key={decade} value={decade}>{decade}</option>;
              })}
            </select>
          </div>
          
          <div className='col-sm-2' id='number-albums-shown'></div>

        </div>
        <hr />
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
                    <th> </th>
                  </tr>
                </thead>

                <tbody id='albums-body'>
                  {AlbumRows(this, this.state['albums'], this.state.currentDecade)}
                </tbody>
              </table>
            </div>
          </div>
          <div className="col-sm-2">

            <form id='append-form' onSubmit={(e) => { this.addAlbum(e) }} width='100%'
              method="dialog" className="form-inline">
              <h4>Add new album:</h4>
              <label htmlFor="position">Position:</label>
              <input type="number" name="position" min="1" defaultValue="1" className="form-control" ref={(value) => { this.number = value; }} />

              <label htmlFor="title">Title:</label>
              <input type="text" name="title" placeholder="title" className="form-control" required ref={(value) => { this.title = value; }} />

              <label htmlFor="year">Year:</label>
              <input type="number" name="year" min="1900" max="2022" defaultValue="2021" className="form-control" required ref={(value) => { this.year = value; }} />

              <label htmlFor="artist">Artist:</label>
              <input type="text" name="artist" placeholder="artist" className="form-control" required ref={(value) => { this.artist = value; }} />
              <br />

              <button type="submit" className="btn btn-primary" id="append">
                add album
              </button>

            </form>

          </div>
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
function AlbumRows(app, albums, currentDecade) {

  if (Object.keys(albums).length === 0) return;

  albums = albums.sort((a, b) => a.number - b.number);

  var tds = [];

  let albumsShown = 0;

  for (let i = 0; i < albums.length; i++) {
    const albumData = albums[i];
    if (currentDecade !== 'All time' && getDecade(albumData.year) !== currentDecade) continue;
    albumsShown++;
    tds.push(
      <tr className="album-row" id="album-row" draggable="true" key={albumData._id}  >
        <td className='number' id='number'>{albumData.number}</td>
        <td className='title'>{albumData.title}</td>
        <td className='year'>{albumData.year}</td>
        <td className='artist'>{albumData.artist}</td>
        <td><button className='btn btn-danger' id="delete-button" value={[i, albumData._id]} onClick={(e) => app.deleteAlbum(e)}>delete</button></td>
        {app.EditPopUp(i)}
      </tr>
    );
  }
  document.getElementById('number-albums-shown').innerHTML = albumsShown + " albums in " + currentDecade;
  if (albumsShown === 0) return <h2>No albums found for {currentDecade}. Add one or try a different decade!</h2>;
  return tds;
}

function getDecade(year) {
  return year.toString().substring(2, 3) + '0s';
}