import React, { useState, useEffect } from 'react';
import { Card, Container } from 'react-bootstrap';
import { Pagination } from 'antd';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import 'antd/dist/antd.css';

function App() {

  const [items, setItems] = useState([])
  const [text, setText]= useState('')
  const [nextPageToken, setNextPageToken] = useState('')
  const [prevPageToken, setPrevPageToken] = useState('')
  const [showPage, setShowPage]= useState(false)
  
  const cssButton = {
    'font-family': 'Hack, monospace',
    'background': 'transparent',
    'color': '#ffffff',
    'cursor': 'pointer',
    'font-size': '1em',
    'padding': '0.5rem',
    'border': 0,
    'transition': 'all 0.5s',
    'border-radius': '10px',
  };

  // let active = 'none';
  function onChange(event) {
    console.log(event)
    return execute()
  }

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
      // "pageToken": nextPageToken,
      "nextPageToken": nextPageToken,
      "prevPageToken": prevPageToken,
      "maxResults": 10,
      "q": text,
      "type": [
        "video"
      ]
    })
        .then(function(response) {
                console.log(response.result)
                setShowPage(true)
                setText(text)
                // setItems([...items, ...response.result.items])
                setItems(response.result.items)
                setNextPageToken(response.result.nextPageToken)
                setPrevPageToken(response.result.prevPageToken)
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
          className="form-control search"
          type="text"
          value={text}
          placeholder="what do you want??"
          onChange={(event) => {
            // console.log(event.target.value)
            setText(event.target.value)
            
            // if(event.key === 'Enter'){
            //   execute(event.target.value)
            // }
          }}
        />
        <button style={cssButton} onClick={execute}>search</button>
        </header>
        <div className='con'>
        <Container >
        
        <div className="row row-cols-md-3">
          {items.map(item => (
          <div className="col mb-4">
            <Card>
              <iframe variant="top"  src={`https://www.youtube.com/embed/${item.id.videoId}`} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>  
              <Card.Body>
              <Card.Title style={{fontSize:'12pt', color: 'grey'}}>{item.snippet.title}</Card.Title> 
              </Card.Body>
            </Card>
          </div>
          ))}
        </div>
     
        
        {showPage?
            <Pagination
              className='text-center'
              size="small"
              // current={1}
              // pageSize={10}
              total={30}
              onChange={(event)=>{
                // console.log(event)
                onChange()
              }}
            />
            :
            ''
        
        }
        </Container>
        </div>
    </div>
  );
}

export default App;
