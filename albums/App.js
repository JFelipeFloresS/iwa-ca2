var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import './App.css';
import React, { useState, useEffect } from 'react';
import fetch from 'isomorphic-fetch';

export var App = function (_React$Component) {
  _inherits(App, _React$Component);

  function App(props) {
    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

    _this.allAlbums = {};
    return _this;
  }

  _createClass(App, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'table',
        null,
        React.createElement(
          'thead',
          null,
          React.createElement(
            'tr',
            { id: 'album-list-head' },
            React.createElement(
              'th',
              null,
              'Position'
            ),
            React.createElement(
              'th',
              null,
              'Title'
            ),
            React.createElement(
              'th',
              null,
              'Year'
            ),
            React.createElement(
              'th',
              null,
              'Artist'
            ),
            React.createElement(
              'th',
              null,
              ' '
            )
          )
        ),
        React.createElement(
          'tbody',
          { id: 'albums-body' },
          React.createElement(TableBody, null)
        )
      );
    }
  }]);

  return App;
}(React.Component);;

export function TableBody() {
  var _useState = useState({}),
      _useState2 = _slicedToArray(_useState, 2),
      albums = _useState2[0],
      setAlbums = _useState2[1];

  useEffect(function () {
    fetch('https://8000-jfelipefloress-iwaca2-bhz3f58ywc6.ws-eu44.gitpod.io/albums').then(function (res) {
      return res.text();
    }).then(function (albumsRes) {
      setAlbums(albumsRes);
    });
  }, [albums]);

  if (Object.keys(albums).length === 0) return;

  var tds = [];

  albums = JSON.parse(albums).sort(function (a, b) {
    return a.position - b.position;
  });
  for (var i = 0; i < albums.length; i++) {
    if (i >= 500) break;
    var album = albums[i];
    tds.push(albumRow(album));
  }

  return tds;
}

function albumRow(album) {
  return React.createElement(
    'tr',
    { className: 'album-row', id: 'album-row', draggable: 'true', key: album.number },
    React.createElement(
      'td',
      { className: 'number', id: 'number' },
      album.number
    ),
    React.createElement(
      'td',
      { className: 'title' },
      album.title
    ),
    React.createElement(
      'td',
      { className: 'year' },
      album.year
    ),
    React.createElement(
      'td',
      { className: 'artist' },
      album.artist
    ),
    React.createElement(
      'td',
      null,
      React.createElement(
        'button',
        { className: 'btn btn-danger', id: 'delete-button' },
        'delete'
      )
    )
  );
}