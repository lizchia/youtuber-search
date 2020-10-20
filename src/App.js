import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import { CardDeck, Card, Container, Row, Pagination } from 'react-bootstrap';
import ReactPaginate from 'react-paginate';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {

  const [items, setItems] = useState([])
  const [text, setText]= useState('')
  const [nextPageToken, setNextPageToken] = useState('')
  
  const cssButton = {
    'font-family': 'Hack, monospace',
    'background': '#0F0F6D',
    'color': '#ffffff',
    'cursor': 'pointer',
    'font-size': '1em',
    'padding': '0.5rem',
    'border': 0,
    'transition': 'all 0.5s',
    'border-radius': '10px',
    'width': '10%',
  };

  let active = 1;
  let page = [];
  for (let number = 1; number <= 3; number++) {
    page.push(
      <Pagination.Items key={number} active={number === active}>
        {number}
      </Pagination.Items>,
    );
  }

  const paginationBasic = (
    <div>
      <Pagination>{page}</Pagination>
    </div>
  );

   function authenticate() {
     console.log('click')
    return window.gapi.auth2.getAuthInstance()
        .signIn({scope: "https://www.googleapis.com/auth/youtube.force-ssl"})
        .then(function() { console.log("Sign-in successful"); },
              function(err) { console.error("Error signing in", err); });
  }
    function loadClient() {
      window.gapi.client.setApiKey("AIzaSyDsm_ab8iLjXFbn1te-Z7T-BjeXd-QdbK8");
    return window.gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
              function(err) { console.error("Error loading GAPI client for API", err); });
  }
    function execute() {
    return window.gapi.client.youtube.search.list({
      "part": [
        "snippet"
      ],
      "pageToken": nextPageToken,
      "maxResults": 30,
      "q": text,
      "type": [
        "video"
      ]
    })
        .then(function(response) {
                setText(text)
                setItems([...items, ...response.result.items])
                setNextPageToken(response.result.nextPageToken)
                console.log("Response", response);
              },
              function(err) { console.error("Execute error", err); });
  }


  useEffect(()=> {
    window.gapi.load("client:auth2", function() {
      window.gapi.auth2.init({client_id: "1012890828153-7dl5k609jjhupftakqj208sobdnr8uuu.apps.googleusercontent.com"});
    }); 
  },[])


  return (
    <div className="App">
      
        <header>
        <button style={cssButton} onClick={()=> {authenticate().then(()=> loadClient())}}>Log in</button>
        <input
          id="searchbar"
          className="form-control"
          type="text"
          value={text}
          placeholder="what do you want??"
          onChange={(event) => {
            console.log(event.target.value)
            setText(event.target.value)
          }}
        />
        <button style={cssButton} onClick={execute}>search</button>
        
        <Container>
        
        <div className="row row-cols-md-3">
          {items.map(item => (
          <div className="col mb-4">
            <Card>
              <iframe variant="top"  src={`https://www.youtube.com/embed/${item.id.videoId}`} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>  
              <Card.Body>
              <Card.Title>{item.snippet.title}</Card.Title> 
              </Card.Body>
            </Card>
          </div>
          ))}
        </div>
     
        </Container>

        {/* <button onClick={execute}>load more</button> */}
        {/* <button onClick={execute}>2</button>
        <button onClick={execute}>3</button> */}

        <paginationBasic />


        </header>
    </div>
  );
}

export default App;
