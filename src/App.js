import React, {
  useState,
  useEffect
} from "react";
import {
  Card,
  Container
} from "react-bootstrap";
import {
  Pagination
} from "antd";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "antd/dist/antd.css";

function App() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState("");
  const [currentPage, setCurrentPage] = useState("");
  const [nextPageToken, setNextPageToken] = useState("");
  const [prevPageToken, setPrevPageToken] = useState("");
  const [pageStorage, setPageStorage] = useState({});
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
  // const pageStorage = [];
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
    const login = localStorage.setItem('client', '1234')
    return window.gapi.auth2
      .getAuthInstance(login)
      .signIn({
        scope: "https://www.googleapis.com/auth/youtube.force-ssl"
      })
      .then(
        function () {
          console.log("Sign-in successful");
          localStorage.getItem('client', '')

        },
        function (err) {
          console.error("Error signing in", err);
        }

      );
  }

  function loadClient() {
    window.gapi.client.setApiKey("AIzaSyDsm_ab8iLjXFbn1te-Z7T-BjeXd-QdbK8");
    return window.gapi.client
      .load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
      .then(
        function () {
          console.log("GAPI client loaded for API");
          localStorage.getItem('client', '')
        },
        function (err) {
          console.error("Error loading GAPI client for API", err);
        }
      );
  }

  function fetchYoutubeResult(token = null) {
    let param = {
      part: ["snippet"],
      maxResults: 9,
      q: text,
      type: ["video"]
    };
    if (token) {
      param.pageToken = token;
    }
    // pageStorage = [{page:'1'},{page:'2'},{page:'3'}];
    return window.gapi.client.youtube.search.list(param).then(

      function (response) {
        console.log(response.result.items);
        setShowPage(true);
        setText(text);
        setItems(response.result.items);
        console.log(...items);
        // setItems(...items,...response.result.items);
        setNextPageToken(response.result.nextPageToken);
        setPrevPageToken(response.result.prevPageToken);
        //setPageStorage([...pageStorage, ...response.result.items]);
        let newPageData = {};
        newPageData[token] = response.result.items;
        setPageStorage(Object.assign(pageStorage, newPageData));
        console.log(pageStorage);
      },
      function (err) {
        console.error("Execute error", err);
      }
    );
  }

  useEffect(() => {
    window.gapi.load("client:auth2", function () {
      window.gapi.auth2.init({
        client_id: "1012890828153-7dl5k609jjhupftakqj208sobdnr8uuu.apps.googleusercontent.com"
      });
    });
  }, []);

  return (
<<<<<<< HEAD
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
=======

      <
      div className = "App" >
      <
      header >
      <
      button style = {
        cssButton
      }
      onClick = {
        () => {
          authenticate().then(() => loadClient())
        }
      } >
      Log in
      <
      /button> <
      input id = "searchbar"
      className = "form-control search"
      type = "text"
      value = {
        text
      }
      placeholder = "what do you want??"
      onChange = {
        event => {
          setText(event.target.value);
        }
      }
      /> <
      button style = {
        cssButton
      }
      onClick = {
        () => {
          changePage();
        }
      } >
      search <
      /button>  < /header > <
      div className = "con" >
      <
      Container >
      <
      div className = "row row-cols-md-3" > {
        items.map(item => ( <
          div className = "col mb-4" >
          <
          Card >
          <
          a href = {
            `https://www.youtube.com/watch?v=${item.id.videoId}`
          } > <
          img variant = "top"
          style = {
            {
              width: '100%'
            }
          }
          src = {
            `http://img.youtube.com/vi/${item.id.videoId}/default.jpg`
          }
          alt = 'youtube video' >
          <
          /img> < /a > <
          Card.Body >
          <
          Card.Title style = {
            {
              fontSize: "12pt",
              color: "grey"
            }
          } > {
            item.snippet.title
          } <
          /Card.Title> < /
          Card.Body > <
          /Card> < /
          div >
        ))
      } <
      /div> {
      showPage ? ( <
        Pagination className = "text-center"
        size = "small"
        total = {
          30
        }
        onChange = {
          page => {
            console.log(page)
            changePage(page);
            // setPageStorage([pageStorage]);
            let pageStorages = [{
              page: '1'
            }, {
              page: '2'
            }, {
              page: '3'
            }];
            setPageStorage(pageStorages)
          }
        }
>>>>>>> 9e241eb... Spead & Obj.assign Method
        />
      ) : (
        ""
      )
    } <
    /Container> < /
  div > <
    /div>
);
}

export default App;