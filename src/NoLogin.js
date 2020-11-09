import React, { useState, useEffect } from 'react';
import { Card, Container } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function NoLogin() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState('');
  const [nextPageToken, setNextPageToken] = useState('');
  const [showPage, setShowPage] = useState(false);

  const cssButton = {
    'font-family': 'Hack, monospace',
    background: 'transparent',
    color: '#707C74',
    cursor: 'pointer',
    'font-size': '1em',
    padding: '0.5rem',
    border: 0,
    transition: 'all 0.5s',
    'border-radius': '10px',
  };

  function start(reset = false) {
    // Initializes the client with the API key and the Translate API.
    window.gapi.client
      .init({
        apiKey: 'AIzaSyDsm_ab8iLjXFbn1te-Z7T-BjeXd-QdbK8',
        discoveryDocs: [
          'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest',
        ],
      })
      .then(function () {
        // Executes an API request, and returns a Promise.
        // The method name `youtube.search.list` comes from the API discovery.
        return window.gapi.client.youtube.search.list({
          part: ['snippet'],
          maxResults: 9,
          pageToken: nextPageToken,
          q: text,
          type: ['video'],
        });
      })
      .then(
        function (response) {
          console.log(response.result.item);
          setShowPage(true);
          setText(text);
          reset
            ? setItems(response.result.items)
            : setItems([...items, ...response.result.items]);
          setNextPageToken(response.result.nextPageToken);
        },
        function (err) {
          console.error('Execute error', err);
        }
      );
  }

  useEffect(() => {
    window.gapi.load('client', start);
  }, []);

  return (
    <div className="App">
      <header>
        <input
          id="searchbar"
          className="form-control search"
          type="text"
          value={text}
          placeholder="what do you want??"
          onChange={(event) => {
            setText(event.target.value);
          }}
        />
        <button
          style={cssButton}
          onClick={() => {
            start(true);
          }}
        >
          search
        </button>
      </header>
      <div className="con">
        <Container>
          <div className="row row-cols-md-3">
            {items.map((item) => (
              <div className="col mb-4">
                <Card>
                  <a
                    href={`https://www.youtube.com/watch?v=${item.id.videoId}`}
                  >
                    <img
                      variant="top"
                      style={{
                        width: '100%',
                      }}
                      src={`http://img.youtube.com/vi/${item.id.videoId}/default.jpg`}
                      alt={item.snippet.description}
                    ></img>
                  </a>
                  <Card.Body>
                    <Card.Title
                      style={{
                        fontSize: '12pt',
                        color: 'grey',
                      }}
                    >
                      {item.snippet.title}
                    </Card.Title>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
          {showPage ? (
            <div className="d-flex justify-content-center">
              <button
                style={cssButton}
                onClick={() => {
                  start();
                }}
              >
                Load more
              </button>
            </div>
          ) : (
            ''
          )}
        </Container>
      </div>
    </div>
  );
}
export default NoLogin;
