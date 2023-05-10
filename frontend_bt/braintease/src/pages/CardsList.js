import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { URL } from "../constants/API_URL";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import SVG from "../components/SVG";
import { icons } from "../icons";
import { shuffle, svgStyles } from "../utils";
import "../css/CardsList.css";
import LoadingIcon from "../components/LoadingIcon";

export default function CardsList() {

  const {d_id} = useParams(); // Deck Id.
  const navigate = useNavigate();
  const [data, setData] = React.useState([]); // Cards.
  const [orgData, setOrgData] = React.useState([]); // Original order of cards.
  const [deck, setDeck] = React.useState(undefined);
  const [error, setError] = React.useState({isError: false, message: ''}); // Page Load Error.
  const [isLoading, setIsLoading] = React.useState(true);
  const [cardStatus, setCardStatus] = React.useState(0.5); // Low opacity while cards load.
  const [isShuffled, setIsShuffled] = React.useState(false);
  
  React.useEffect(() => {
    const getData = async () => {
      try {
        await axios.get(URL.main + URL.c_r_card + d_id)
              .then(res => {
                setData(res.data);
                setCardStatus(1);
              })
      } catch (err) {
        console.log(err)
        setError({isError: true, message: err.message});
      }
    }

    const getDeck = async () => {
      try {
        await axios.get(URL.main + URL.c_r_deck)
                  .then(res => {
                    setDeck(res.data.filter(deck => String(deck.pk) === d_id)[0]);
                    setIsLoading(false);
                  })
      } catch (err) {
        console.log(err);
        setError({isError: true, message: err.message});
      }
    }

    getDeck();
    getData();
  }, [d_id]);

  const handleCardEdit = (id) => {
    // Re-route to card editor.
    navigate(`/${d_id}/${id}/edit_card`)
  }

  const handleCardDelete = (id) => {
    // Wait untill the card is deleted, then reset(re-render) data.
    const deleteCard = async () => {
      try {
        await axios.delete(URL.main + URL.u_d_card + id)
                .then(res => {
                  console.log(res)
                  axios.get(URL.main + URL.c_r_card + d_id)
                    .then(res => {
                      setData(res.data);
                    })
                    .catch(err => console.log(err))
                })
      } catch (err) {
        console.log(err);
        // To-Do: Indicate that card hasn't been deleted.
      }
    }

    deleteCard();
  }

  const handleShuffle = () => {
    setOrgData(data);
    if (isShuffled) {
      setData(orgData);
      setIsShuffled(false);
    } else {
      setData(shuffle(data));
      setIsShuffled(true);
    }
  }

  const handleStartSession = () => {
    navigate(`/${d_id}/session`, {state: data});
  }

  return (
    <Container>
      {isLoading || error.isError
        ? <Row>
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
        : <><Row style={{ marginTop: 30, marginBottom: 30 }}>
          <Button onClick={() => navigate(`/${d_id}/create_cards`)}
            className="top-btn" variant="hp">
            {svgStyles(icons.addCard, "width: 20px; height: 20px")}
          </Button>
          <Button onClick={handleShuffle} active={isShuffled}
          className="top-btn" variant="hp">
            {icons.shuffle}
          </Button>
        </Row>
          <Row>
            <Col style={{ display: 'block' }}>
              {(deck === undefined) ? null :
                <div className="sc-deck-card">
                  <div className="sc-deck deckCover">
                    <SVG svg={deck.coverSVG} size={'m'} />
                  </div>
                  <div className="sc-deck deck-info">
                    <h3 className="sc-title">{deck.name}</h3>
                    <p className="sc-desc">{deck.description}</p>
                  </div>
                  <Button className="sc-session-btn" variant="hp"
                  onClick={handleStartSession}>
                    Start Session  
                    {svgStyles(icons.play, "width: 20px; height: 20px; margin-left: 5px")}
                  </Button>
                </div>}
              {data.length === 0
                ? <h3 style={{ opacity: cardStatus }}>No Cards</h3>
                : data.map(card => {
                  return (
                    <div className="cont-card-btn" key={card.pk}>
                      <div className="container-card-flip">
                        <div className="content-card">
                          <div className="front cardSide">
                            <SVG svg={card.frontSVG} size={'s'} />
                          </div>
                          <div className="back cardSide">
                            <SVG svg={card.backSVG} size={'s'} />
                          </div>
                        </div>
                      </div>
                      <div className="sc-card-btn-cont">
                        <Button onClick={() => handleCardEdit(card.pk)}
                          className="sc-btn" variant="hp">
                          {icons.edit}
                        </Button>
                        <Button onClick={() => handleCardDelete(card.pk)}
                          className="sc-btn" variant="hp">
                          {icons.trash}
                        </Button>
                      </div>
                    </div>
                  )
                })}
            </Col>
          </Row></>}
    </Container>
  )
}





