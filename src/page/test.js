import React, { useState, useEffect } from 'react';
import { CardDeck, Card, Container, Row, Col } from 'react-bootstrap';

function Test(props) {
const {excute, items} = props

return(
<Container>
        
        <div className="row row-cols-md-3">
          {items.map(item => (
          <div className="col mb-4">
            <Card>
            
            <iframe variant="top"  width="300" height="170" src={`https://www.youtube.com/embed/${item.id.videoId}`} fframeBorder="0" allow="accelerometer; 
                autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>  
            <Card.Body>
              <Card.Title>{item.snippet.title}</Card.Title>
              
              
            </Card.Body>
          </Card>
          </div>
          ))}
        </div>
     
</Container>
)
}
export default Test;