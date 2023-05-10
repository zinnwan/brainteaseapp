import React from "react";
import axios from 'axios';
import { resize } from "../utils";
import parse from 'html-react-parser';
import { URL } from '../constants/API_URL';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { useNavigate } from 'react-router-dom';
import { icons } from "../icons";
import { svgStyles } from "../utils";
import "../css/DeckList.css";
import LoadingIcon from "../components/LoadingIcon";
const invert = require('invert-color');

export default function DeckList() {

  const [data, setData] = React.useState([]);
  const navigate = useNavigate();
  const [error, setError] = React.useState({isError: false, message: ''});
  const [isLoading, setIsLoading] = React.useState(false);
  const iconCss = "width: 20px; height: 20px";

  React.useEffect(() => {

    const getData = async () => {
      try {
        setIsLoading(true);
        await axios.get(URL.main + URL.c_r_deck)
              .then(res => {
                setData(res.data);
                setIsLoading(false);
              })
      } catch (err) {
        setError({isError: true, message: err.message})
      }
    }
    getData();
    
    }, []);

    const handleDelete = (id) => {
      const deleteDeck = async () => {
        try {
          await axios.delete(URL.main + URL.u_d_deck + id)
                  .then(res => {
                    console.log(res)
                    axios.get(URL.main + URL.c_r_deck)
                      .then(res => {
                        console.log(res);
                        setData(res.data);
                      })
                      .catch(err => console.log(err))
                  })
        } catch (err) {
          console.log(err)
        }
      }

      deleteDeck()
    }
  
  return (
    <Container>
      <Row>
        {
          error.isError && 
          <Alert variant="danger" className="error-message">
            You seem to have a "{error.message}" problem
          </Alert>
        }
        {
          (isLoading && !error.isError) && 
          <LoadingIcon />
        }
      </Row>
      <Row>
        <Col style={{display: 'flex', flexWrap: 'wrap'}}>
          {data.map(deck => {
            const svg = parse(deck.coverSVG, resize(200, 275));
            const bgColor = invert(deck.coverJSON.background);
            const fontColor = invert(bgColor, true);
            return (
              <div key={deck.pk} className="deck">
                <div className="deck-card">
                  <div className="card deck-cover">
                    {svg}
                  </div>
                  <div className="card desc" 
                  onClick={() => navigate(`/${deck.pk}/cards`)} 
                  style={{backgroundColor: bgColor, color: fontColor}}>
                    <h5 className="dl-card-title">{deck.name}</h5>
                    <p className="dl-desc">{deck.description}</p>
                  </div>
                </div>
                <div className="btns-container">
                  <Button className="card-btn-icon" variant="hp"
                    onClick={() => navigate(`/${deck.pk}/cards`)}>
                    {svgStyles(icons.eye, iconCss)}
                  </Button>
                  <Button className="card-btn-icon" variant="hp"
                    onClick={() => navigate(`/${deck.pk}/edit_deck`)}>
                    {svgStyles(icons.edit, iconCss)}
                  </Button>
                  <Button className="card-btn-icon" variant="hp"
                    onClick={() => handleDelete(deck.pk)}>
                    {svgStyles(icons.trash, iconCss)}
                  </Button>
                  <Button className="card-btn-icon" variant="hp"
                    onClick={() => navigate(`/${deck.pk}/session`)}>
                    {svgStyles(icons.play, iconCss)}
                  </Button>
                </div>
              </div>
            )
          })}
        </Col>
      </Row>
    </Container>
  )
}

