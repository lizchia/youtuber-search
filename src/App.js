import React, { useState, useEffect } from "react";
import { Card, Container } from "react-bootstrap";
import { Pagination } from "antd";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "antd/dist/antd.css";

function App() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");
  const [currentPage, setCurrentPage] = useState("");
  const [nextPageToken, setNextPageToken] = useState("");
  const [prevPageToken, setPrevPageToken] = useState("");
  const [showPage, setShowPage] = useState(false);

  const cssButton = {
    "font-family": "Hack, monospace",
    background: "transparent",
    color: "#ffffff",
    cursor: "pointer",
    "font-size": "1em",
    padding: "0.5rem",
    border: 0,
    transition: "all 0.5s",
    "border-radius": "10px"
  };

  async function changePage(page) {
    let iterate = currentPage ? Math.abs(page - currentPage) : 1;
    for (let i = 0; i < iterate; i++) {
      await fetchYoutubeResult(
        currentPage ? (page > currentPage ? prevPageToken : nextPageToken) : ""
      );
    }
    setCurrentPage(page);
  }

  function authenticate() {
    return window.gapi.auth2
      .getAuthInstance()
      .signIn({ scope: "https://www.googleapis.com/auth/youtube.force-ssl" })
      .then(
        function() {
          console.log("Sign-in successful");
        },
        function(err) {
          console.error("Error signing in", err);
        }
      );
  }

  function loadClient() {
    window.gapi.client.setApiKey("AIzaSyDsm_ab8iLjXFbn1te-Z7T-BjeXd-QdbK8");
    return window.gapi.client
      .load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
      .then(
        function() {
          console.log("GAPI client loaded for API");
        },
        function(err) {
          console.error("Error loading GAPI client for API", err);
        }
      );
  }

  function fetchYoutubeResult(token = null) {
    let param = { part: ["snippet"], maxResults: 10, q: text, type: ["video"] };
    if (token) {
      param.pageToken = token;
    }

    return window.gapi.client.youtube.search.list(param).then(
      function(response) {
        setShowPage(true);
        setText(text);
        setItems(response.result.items);
        setNextPageToken(response.result.nextPageToken);
        setPrevPageToken(response.result.prevPageToken);
      },
      function(err) {
        console.error("Execute error", err);
      }
    );
  }

  useEffect(() => {
    window.gapi.load("client:auth2", function() {
      window.gapi.auth2.init({
        client_id:
          "1012890828153-7dl5k609jjhupftakqj208sobdnr8uuu.apps.googleusercontent.com"
      });
    });
  }, []);

  return (
    <div className="App">
      <header>
        <button
          style={cssButton}
          onClick={() => {
            authenticate().then(() => loadClient());
          }}
        >
          Log in
        </button>
        <input
          id="searchbar"
          className="form-control search"
          type="text"
          value={text}
          placeholder="what do you want??"
          onChange={event => {
            setText(event.target.value);
          }}
          // onKeyPress
        />
        <button
          style={cssButton}
          onClick={() => {
            changePage();
          }}
        >
          search
        </button>
      </header>
      <div className="con">
        <Container>
          <div className="row row-cols-md-3">
            {items.map(item => (
              <div className="col mb-4">
                <Card>
                  <iframe
                    variant="top"
                    src={`https://www.youtube.com/embed/${item.id.videoId}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                  <Card.Body>
                    <Card.Title style={{ fontSize: "12pt", color: "grey" }}>
                      {item.snippet.title}
                    </Card.Title>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
          {showPage ? (
            <Pagination
              className="text-center"
              size="small"
              total={30}
              onChange={page => {
                changePage(page);
              }}
            />
          ) : (
            ""
          )}
        </Container>
      </div>
    </div>
  );
}

export default App;
