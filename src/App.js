import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';



import logo from './logo.svg';
import './App.css';

function App() {

  const [items, setItems] = useState([])
  const [nextPageToken, setNextPageToken] = useState('')
  const [text, setText]= useState('')

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
      "pageToken": nextPageToken,
      "maxResults": 10,
      "q": text,
      "type": [
        "video"
      ]
    })
        .then(function(response) {
                setText(text)
                setItems([...items, ...response.result.items])
                setNextPageToken(response.result.nextPageToken)

                // Handle the results here (response.result has the parsed body).
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
      <header className="App-header">
        
        <button onClick={()=> {authenticate().then(()=> loadClient())}}>Log in</button>
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
      /><button onClick={execute}><i class="fas fa-search"></i>search</button>
        <ul>
          {items.map(item => (
            <li>
                <iframe width="200" height="150" src={`https://www.youtube.com/embed/${item.id.videoId}`} frameborder="0" allow="accelerometer; 
                autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
             
            </li>
          ))}
        </ul>

        <button onClick={execute}>1</button>
        {/* <button onClick={execute}>2</button>
        <button onClick={execute}>3</button> */}




      </header>
    </div>
  );
}

export default App;
