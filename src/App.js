import React, { useState, useEffect, Children } from 'react';
import { Card, Container } from 'react-bootstrap';
import { Pagination } from 'antd';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import 'antd/dist/antd.css';
import { propTypes } from 'react-bootstrap/esm/Image';

export const ThemeContext = React.createContext();
export function Page(props){
  
  const [nextPageToken, setNextPageToken] = useState('');
  const [prevPageToken, setPrevPageToken] = useState('');
  const [pageStorage, setPageStorage] = useState([]);
  let setPageStorages = [...pageStorage];

  return(
    <ThemeContext.Provider value={pageStorage, nextPageToken, prevPageToken, setPageStorages}>
      {props.children}
    </ThemeContext.Provider>
  )
} 

export default function App(propTypes) {
  const [items, setItems] = useState([]);
  const [text, setText] = useState('');
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState('');
  // const [nextPageToken, setNextPageToken] = useState('');
  // const [prevPageToken, setPrevPageToken] = useState('');
  // const [pageStorage, setPageStorage] = useState([]);
  const [showPage, setShowPage] = useState(false);
  const {nextPageToken, setNextPageToken, prevPageToken, setPrevPageToken, pageStorage, setPageStorage}= propTypes

  const cssButton = {
    'font-family': 'Hack, monospace',
    background: 'transparent',
    color: '#ffffff',
    cursor: 'pointer',
    'font-size': '1em',
    padding: '0.5rem',
    border: 0,
    transition: 'all 0.5s',
    'border-radius': '10px',
  };

  async function changePage(page) {
    console.log(page);
    let iterate = currentPage ? Math.abs(page - currentPage) : 1;
    const pageSlice = pageStorage.slice((page - 1) * 9, page * 9 - 1);

    if (pageSlice.length === 0) {
      for (let i = 0; i < iterate; i++) {
        await fetchYoutubeResult(
          currentPage
            ? page > currentPage
              ? nextPageToken
              : prevPageToken
            : ''
        );
        console.log('prev: ', prevPageToken);
        console.log('next: ', nextPageToken);
      }
    } else {
      setItems(pageSlice);
    }

    setCurrentPage(page);
  }

  function authenticate() {
    return window.gapi.auth2
      .getAuthInstance()
      .signIn({
        scope: 'https://www.googleapis.com/auth/youtube.force-ssl',
      })
      .then(
        function () {
          console.log('Sign-in successful');
        },
        function (err) {
          console.error('Error signing in', err);
        }
      );
  }

  function loadClient() {
    window.gapi.client.setApiKey('AIzaSyDsm_ab8iLjXFbn1te-Z7T-BjeXd-QdbK8');
    return window.gapi.client
      .load('https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest')
      .then(
        function () {
          console.log('GAPI client loaded for API');
        },
        function (err) {
          console.error('Error loading GAPI client for API', err);
        }
      );
  }
  
  function fetchYoutubeResult(token = null) {
    let param = {
      part: ['snippet'],
      // maxResults: 9,
      q: text,
      type: ['video'],
    };

    if (token) {
      param.pageToken = token;
    }

    return window.gapi.client.youtube.search.list(param).then(
      function (response) {
        console.log(response.pageInfo);
        setShowPage(true);
        setText(text);
        setItems(response.result.items);
        setTotalPage(response.result.pageInfo.totalResults)
        setNextPageToken(response.result.nextPageToken);
        setPrevPageToken(response.result.prevPageToken);
        setPageStorage([...pageStorage, ...response.result.items]);
        console.log(pageStorage);
        console.log('res.next:', response.result.nextPageToken);
        console.log('res.prev:', response.result.prevPageToken);
      },
      function (err) {
        console.error('Execute error', err);
      }
    );
  }

  useEffect(() => {
    window.gapi.load('client:auth2', function () {
      window.gapi.auth2.init({
        client_id:
          '1012890828153-7dl5k609jjhupftakqj208sobdnr8uuu.apps.googleusercontent.com',
      });
    });
  }, []);

  return (
    <Page>
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
          onChange={(event) => {
            setText(event.target.value);
          }}
        />
        <button
          style={cssButton}
          onClick={() => {
            changePage();
          }}
        >
          search
        </button>
        {/* <div>
          <a href="/NoLogin">No</a>
        </div> */}
      </header>
      <div className="con">
        <Container>
          <div className="row row-cols-1 row-cols-md-3">
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
            <Pagination
              className="text-center"
              size="small"
              total={totalPage}
              pageSize={9}
              onChange={(currentPage) => {
                changePage(currentPage);
              }}
            />
          ) : (
            ''
          )}
        </Container>
      </div>
    </div>
    </Page>
  );
}

