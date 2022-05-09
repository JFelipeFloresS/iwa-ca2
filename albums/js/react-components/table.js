import React, {useState, useEffect} from 'react';
import AlbumRow from 'album-row';
import { response } from 'express';

function Table() {
    // data state and storage
    const [albums, setAlbums] = useState([]);

    useEffect(() => {
        LoadData();
        //GetAlbums();
    }, []);

    const LoadData = async () => {
        await fetch('/albums')
            .then(response => response.json())
            .then(receivedAlbums => setAlbums(receivedAlbums));
    }

    return (
        <table id='albums-table' class='table table-striped' >
            <thead>
                <th>Position</th>
                <th>Title</th>
                <th>Year</th>
                <th>Artist</th>
                <th> </th> 
                <th> </th>
            </thead>
            <tbody id='tableBody'>
                <td>BLABEIRA</td>
                {
                //this.albums.forEach(element => {
                //    React.createElement(AlbumRow, element);
                //})
                }
            </tbody>
        </table>
    );
    
}

await ReactDOM.render(<Table />, document.getElementById("results"));

export default Table;
