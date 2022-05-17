import './App.css';
import React from 'react';
import fetch from 'isomorphic-fetch';
import mongoose from 'mongoose';
import Popup from 'reactjs-popup';

export class App extends React.Component {

  /**
  * Defines state of app
  */
  constructor(props) {
    super(props);
    
    // declaration of state retrieved from https://stackoverflow.com/questions/60961065/unable-to-use-usestate-in-class-component-react-js
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

  /**
   * Add album to state and update the albums state array
   * @param {JSON} album album to be added
  */
  addAlbumToState(album) {
    if (this.state.albums.length < album.number) album['number'] = this.state.albums.length + 1; // adjust album position if added after the end of list

    const position = album.number;
    var sortedAlbums = this.state.albums;

    let currPos = position;

    sortedAlbums.sort((a, b) => a.number - b.number); // retrieved from https://stackoverflow.com/questions/979256/sorting-an-array-of-objects-by-property-values

    /**
    * Iterate through albums array sorted by position and adjust their position accordingly
    */
    for (let i = 0; i < sortedAlbums.length; i++) { 
      const currAlbum = sortedAlbums[i];
      if (currPos == currAlbum.number) {
        currAlbum.number++;
        currPos++;
      };
    }

    sortedAlbums.push(album);

    // retrieved from https://www.geeksforgeeks.org/how-to-update-the-state-of-a-component-in-reactjs/
    this.setState({
      albums: sortedAlbums
    })

    var albums = {};

    /**
    * Create JSON with id as key and the values as body to send to API
    */
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
   *  Update option selected on decades select tag
   *  based on https://stackoverflow.com/questions/68790381/how-to-use-onchange-in-react-select
   *  @param {ClickEvent} e select tag changed
  */
  updateSelectedDecade(e) {
    e.preventDefault();
    this.setState({
      currentDecade: e.target.value
    });
  }

  /**
   * Get albums from API
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

  /**
  * Change state of albums
  * @param {JSON} newAlbums albums to be set as albums state
  */
  setAlbums(newAlbums) {
    this.setState({
      albums: newAlbums
    });
  }

  /**
   * Add album to DB and react state array
   * @param {ClickEvent} e mouse click
   */
  addAlbum(e) {

    e.preventDefault();

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
   * Define position and id of album to be deleted and call deleteFromDBAndList
   * @param {clickEvent} e mouse click
   */
  deleteAlbum(e) {
    e.preventDefault();
    const splitString = e.target.value.split(','); // get both position and id from the same element
    const pos = splitString[0];
    const id = splitString[1];

    this.deleteFromDBAndList(id, pos);

  }

  /**
  * Delete an album from DB and albums state array
  * @param {int} id id on DB
  * @param {int} pos index in albums state array
  */
  deleteFromDBAndList(id, pos) {

    var sortedAlbums = [...this.state.albums];
    
    if (index !== -1) sortedAlbums.splice(pos, 1); // remove album from array retrieved from https://www.w3docs.com/snippets/javascript/how-to-remove-an-element-from-an-array-in-javascript.html

    let currPos = parseInt(pos) + 1;

    sortedAlbums.sort((a, b) => a.number - b.number);

    /**
    * adjust position of remaining albums after removal 
    */
    for (let i = 0; i < sortedAlbums.length; i++) {
      const currAlbum = sortedAlbums[i];
      if (currPos > parseInt(pos) && currPos < parseInt(currAlbum.number)) {
        currAlbum.number = currPos;
        currPos++;
      };
    }



    var albums = {};

    /**
    * Create dictionary with id as key and body as value
    */
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
    
    /**
    * delete album
    */
    fetch(this.state.apiUri + id, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(json => console.log("deleted", json))
      .catch(err => console.log("Error: ", err));

    /**
    * update all albums
    */
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

    this.setState({
      albums: sortedAlbums
    })
  }

  /**
  * Open popup to edit album
  * @param {int} i index of album to be edited
  */
  EditPopUp(i) {
    let albumData = this.state.albums[i];
    
    /**
    * Form to update an album within a div
    * onSubmit calls updateAlbum and clears the innerHTML of the div
    */
    return (
      <Popup position="left center" trigger={<td><button className='btn btn-warning' id="delete-button">edit</button></td>}>
        <div id="edit-popup" style={{ "backgroundColor": "rgba(125, 125, 125, 0.95)", "width": "50vw", "color": "snow" }}>
          <h1>Edit</h1>
          <form className="form-control" id='edit-form' method='dialog' style={{ "backgroundColor": "rgba(255, 255, 255, 0.5)" }} onSubmit={(e) => { this.updateAlbum(e); document.getElementById('edit-popup').innerHTML = "" }}>
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

  /**
  * Updates an album using an EditPopUp data
  * @param {ClickEvent} e mouse click
  */
  updateAlbum(e) {
    e.preventDefault();
    const elements = e.target.elements;

    const id = new mongoose.Types.ObjectId(elements.inputAlbumId.value); // create id with mongoose ObjectId to be stored in the DB
    const albumJSON = {
      _id: id,
      number: parseInt(elements.position.value),
      artist: elements.artist.value,
      title: elements.title.value,
      year: parseInt(elements.year.value)
    };

    let i = elements.i.value;
    let updatedAlbums = [...this.state.albums];
    updatedAlbums[i] = albumJSON; // changes element in local variable

    this.editAlbumContent(albumJSON);
    
    /**
    * update position of rest of albums if changing the position of the album
    */
    if (elements.previousNumber.value != elements.position.value) {
      this.updateAlbumsPosition(elements.position.value, elements.inputAlbumId.value, updatedAlbums)
    } else {
      this.setState({
        albums: updatedAlbums
      })
    }
  }

  /**
  * Updates an album in the DB
  * @param {JSON} album new content of album
  */
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

  /**
  * Update albums positions after one album being edited 
  * @param {int} pos position of edited album in the charts
  * @param {int} id id of album that was edited
  * @param {JSON} updatedAlbums albums state array based JSON with the edited album updated
  */
  updateAlbumsPosition(pos, id, updatedAlbums) {
    var sortedAlbums = updatedAlbums;
    sortedAlbums.sort((a, b) => a.number - b.number);

    var currPos = pos;

    /**
    * Fix albums positions in the array
    */
    for (let i = 0; i < sortedAlbums.length; i++) {
      const currAlbum = sortedAlbums[i];
      if (id == currAlbum._id) continue;
      if (currPos == currAlbum.number) {
        currAlbum.number++;
        currPos++;
      };
    }

    var albums = {};

    /**
    * create JSON with id as key and body as value
    */
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

      this.setState({
        albums: sortedAlbums
      })
  }

  /**
   * Render object App
   * @returns decade selector, albums table with AlbumsRows function as tbody and add album form
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

  if (Object.keys(albums).length === 0) return(<h2>No albums in the list. Add one and start your list!</h2>);

  albums = albums.sort((a, b) => a.number - b.number);

  var tds = [];

  let albumsShown = 0;

  for (let i = 0; i < albums.length; i++) {
    const albumData = albums[i];
    if (currentDecade !== 'All time' && getDecade(albumData.year) !== currentDecade) continue; // skips albums that don't belong in the currentDecade
    albumsShown++;
    /**
    * append a tr with album information, a delete button and an edit button that opens an EditPopUp
    */
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

/**
* Transform any given year with four digits into a decade
* @param {int} year year to get decade from
*/
function getDecade(year) {
  return year.toString().substring(2, 3) + '0s';
}
