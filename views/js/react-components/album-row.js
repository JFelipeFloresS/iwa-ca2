class AlbumRow extends React.Component {
    
    constructor(album) {
        this.id = album.id;
        this.title = album.title;
        this.year = album.year;
        this.artist = album.artist;
    };

    render() {
        return (
            <tr class='album-row' id='album-row' draggable='false'>
                <td class='number' id='number'>{this.id}</td>
                <td class='title' contentEditable='false'>{this.title}</td>
                <td class='year' contentEditable='false'>{this.year}</td>
                <td class='artist' contentEditable='false'>{this.artist}</td>
                <td class='btn-td'><button class='btn btn-success' id='update-button' disabled='true'>update</button></td>
                <td class='btn-td'><button class='btn btn-danger' id='delete-button' disabled='true'>delete</button></td>
            </tr>
        );
    }
}