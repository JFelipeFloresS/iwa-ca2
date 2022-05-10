import './App.css';
import React, { useState, useEffect } from 'react';
import fetch from 'isomorphic-fetch';
import album from './models/album';

export class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
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
          <TableBody />
        </tbody>
      </table>
    );
  };

  GetState() {
    return this.state;
  }

  AddAlbum(album) {
    this.state.push(album);
  }

};

let isUpdated = false;
function TableBody() {
  let [albums, setAlbums] = useState({});

  const AddAlbumToList = (newAlbum) => {
    setAlbums(albums.push(newAlbum));
  };

  useEffect(() => {
    if (!isUpdated) {
      fetch('https://8000-jfelipefloress-iwaca2-bhz3f58ywc6.ws-eu44.gitpod.io/albums')
        .then((res) => {
          return res.text();
        })
        .then((albumsRes) => {
          setAlbums(albumsRes);
          isUpdated = true;
        });

    }
  }, [albums]);

  if (Object.keys(albums).length === 0) return;

  var tds = [];

  albums = JSON.parse(albums).sort((a, b) => a.position - b.position);
  for (let i = 0; i < albums.length; i++) {
    if (i >= 500) break;
    const album = albums[i];
    tds.push(albumRow(album));
  }

  return tds;
}

function albumRow(album) {
  return (
    <tr className="album-row" id="album-row" draggable="true" key={album.number}>
      <td className='number' id='number'>{album.number}</td>
      <td className='title'>{album.title}</td>
      <td className='year'>{album.year}</td>
      <td className='artist'>{album.artist}</td>
      <td><button className='btn btn-danger' id="delete-button">delete</button></td>
    </tr>
  );
}

document.getElementById('append').addEventListener('click', AppendElement);

function AppendElement() {
 
  // Gets all inputs within the append-form
  let form = document.getElementById('append-form');
  let inputs = form.querySelectorAll('input');

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