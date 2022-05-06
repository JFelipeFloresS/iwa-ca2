class Table extends React.Component {
    static albums;

    constructor() {
        super();
        this.albums = null;
        try {
            $.getAlbums = function(url) {
                return $.ajax({
                    url: url,
                    type: 'GET',
                    cache: false,
                    data: null,
                    success: function(response) {
                        SetAlbums(response);
                    }
                });
            };
            
            $.getAlbums('/albums');

            console.log(this.albums);

        } catch (error) {
            console.log(error);
        }
    }

    SetAlbums(response) {
        this.albums = response;
    }

    render() {
        return <table id='albums-table' class='table table-striped' >
                <thead>
                    <th>Position</th>
                    <th>Title</th>
                    <th>Year</th>
                    <th>Artist</th>
                    <th> </th> 
                    <th> </th>
                </thead>
                <tbody id='tableBody'>
                    {this.albums.forEach(element => {
                        React.createElement(AlbumRow, element);
                    })}
                </tbody>
            </table>
        ;
    }
}

ReactDOM.render(<Table />, document.getElementById("results"));