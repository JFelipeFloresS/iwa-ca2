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
      dragItem: null,
      isLoaded: false,
      apiUri: 'https://8000-jfelipefloress-iwaca2-xoyy9vh8plh.ws-eu45.gitpod.io/albums'
    };

  }

  /**
   * Fetch albums from DB when component is mounted
   */
  componentDidMount() {
    this.fetchFromApi();
  }

  addAlbumToState(album) {
    if (this.state.albums.length < album.number) album.number = this.state.albums.length;
    const position = album.number;

    let sortedAlbums = this.state.albums;
    sortedAlbums.push(album);
    sortedAlbums.sort((a, b) => a.number - b.number);

    this.setState({
      albums: [...this.state.albums, album]
    })
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

    this.addAlbumToState(newAlbum);
    

    var albumJSON = JSON.stringify(newAlbum);

    fetch(this.state.apiUri, {
      method: 'POST',
      headers: { "Content-type": "application/json; charset=UTF-8" },
      body: albumJSON
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
    fetch(this.state.apiUri + '/' + id, {
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

  EditPopUp(i) {
    let albumData = this.state.albums[i];
    return (
      <Popup position="left center" trigger={<td><button className='btn btn-warning' id="delete-button">edit</button></td>}>
        <div style={{ "backgroundColor": "rgba(125, 125, 125, 0.95)", "width": "50vw", "color": "snow" }}>
          <h1>Edit</h1>
          <form className="form-control" id='edit-form' method='dialog' style={{ "backgroundColor": "rgba(255, 255, 255, 0.5)" }} onSubmit={(e) => this.updateAlbum(e)}>
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

    const albumJSON = {
      _id: elements.inputAlbumId.value,
      number: parseInt(elements.position.value),
      artist: elements.artist.value,
      title: elements.title.value,
      year: parseInt(elements.year.value)
    };

    fetch(this.state.apiUri + '/' + elements.inputAlbumId.value, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(albumJSON)
    })
      .then(res => res.json())
      .then(json => console.log(json))
      .catch(err => console.log(err));

    this.fetchFromApi();

    this.setState({
      albums: [...this.state.albums]
    });
    this.forceUpdate();
  }

  /**
   * Render class App
   * @returns list of albums
   */
  render() {
    return (
      <div>
        <div className='select-div'>
          <label htmlFor="select-year">Show year:</label>
          <select className="select-year form-select"
            name='select-year' style={{'minWidth': '100%'}} onChange={e => this.updateSelectedDecade(e)}>
            {this.state.decades.map(decade => {
              return <option key={decade} value={decade}>{decade}</option>;
            })}
          </select>
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
              {/*<input type="number" name="position" min="1" max="500" defaultValue="1" className="form-control" ref={(value) => {this.number = value;}}/>*/}
              <input type="number" name="position" defaultValue="501" className="form-control" ref={(value) => { this.number = value; }} />

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
    if (currentDecade != 'All time' && getDecade(albumData.year) != currentDecade) continue;
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
  if (albumsShown === 0) return <h2>No albums found for {currentDecade}. Add one or try a different decade!</h2>;
  return tds;
}

function getDecade(year) {
  return year.toString().substring(2, 3) + '0s';
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

