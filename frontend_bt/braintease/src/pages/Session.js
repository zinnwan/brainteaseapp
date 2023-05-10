import React from "react";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { URL } from "../constants/API_URL";
import SessionControls from "../components/SessionControls";
import SessionCards from "../components/SessionCards";
import SessionFinished from "../components/SessionFinished";
import usePlainState from "../components/useplainstate";
// import { icons } from "../icons";
import '../css/Session.css';
import LoadingIcon from "../components/LoadingIcon";

export default function Session() {

  const {d_id} = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = React.useState([]);
  const cards = location.state;
  const [rounds, renderRounds] = usePlainState([
    {num: 1, cards: []},
    {num: 2, cards: []},
    {num: 3, cards: []}
  ]);
  const [currRound, setCurrRound] = React.useState(undefined);
  const [aside, setAside] = React.useState([]);
  const [error, setError] = React.useState({isError: false, message: ''});
  const [isLoading, setIsLoading] = React.useState(true);
  const [start, setStart] = React.useState(false);
  const [isDataPassed, setIsDataPassed] = React.useState(false);
  const [time, setTime] = React.useState(0);
  const [currTime, setCurrTime] = React.useState(0);
  const [isActive, setIsActive] = React.useState(false);
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [isFinished, setIsFinished] = React.useState(false);
  const [stats, setStats] = React.useState([]);
  const [rn, setRn] = React.useState(0);

  React.useEffect(() => {
    const getData = async () => {
      try {
        await axios.get(URL.main + URL.c_r_card + d_id)
                    .then(res => {
                      setData(res.data);
                      setIsLoading(false);
                    })
      } catch (err) {
        console.log(err);
        setError({isError: true, message: err.message});
      }
    }
    
    if (cards === null) {
      getData();
    } else {
      setIsLoading(false);
      setData(cards);
    }
  }, [d_id, cards]);

  React.useEffect(() => {
    // Conditions to make sure it runs once.
    if (data.length > 0) {
      if (!isDataPassed) {
        renderRounds(rounds.map(round => {
          if (round.num === 1) {
            return {...round, cards: data};
          }
           return round;
        }));
        setIsDataPassed(true);
      }
    }
    if (currRound === undefined && rounds[0].cards.length>0) {
      setCurrRound(rounds[0]);
    }
  }, [data, rounds, renderRounds, isDataPassed, currRound]);

  React.useEffect(() => {
    // Timer
    let interval
    if (isActive) {
      interval = setInterval(() => {
        setTime((time) => time + 1);
      }, 10);
    } else {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval)
  }, [isActive]);

  const moveCard = (filtCards, movingCard, isBack) => {
    setStats([...stats, {
      round: currRound.num,
      card: movingCard[0],
      time: currTime
    }]);

    // If we wanna move the card to the next round:
    if (isBack) {
      renderRounds(rounds.map(round => {
        if (round.num === currRound.num+1) {
          return {...round, cards: [...round.cards, movingCard[0]]};
        }
        return round;
      }));
      // If it's the last card:
      if (currRound.cards.length === 1 ) {
        setCurrRound(rounds[currRound.num]);
      } else {
        setCurrRound({...currRound, cards: filtCards});
      }
    // If we want to move it aside:
    } else {
      setAside([...aside, movingCard[0]]);
      setCurrRound({...currRound, cards: filtCards});
    }
  }

  const handleStart = () => {
    setStart(true);
    setIsActive(true);
    rounds.map(round => {
      return setRn((rn) => rn + round.cards.length);
    });
  }

  const handleFlip = () => {
    setIsActive(false);
    setCurrTime(time);
    setTime(0);
    setIsFlipped(true);
  }

  const handleAside = () => {
    const roundNum = currRound.num; 
    // Get the cards without the one just displayed.
    const filteredCards = currRound.cards.filter(card => card !== currRound.cards[0]);
    // Get the card that was just displayed.
    const movingCard = currRound.cards.filter(card => card === currRound.cards[0]);
    // Move the card aside.
    moveCard(filteredCards, movingCard, false);
    setIsFlipped(false);
    setIsActive(true);
    // If there are no more cards after:
    if (currRound.cards.length === 1) {
      // if There is no next round:
      if (roundNum === 3 || rounds[roundNum].cards.length === 0) {
        // Finish session. 
        setIsFinished(true);
        setIsActive(false);
      // If there is a next round:
      } else {
        // Set the current round to the next one.
        setCurrRound(rounds[roundNum]);
      }
    }
  }

  const handleBack = () => {
    const roundNum = currRound.num; 
    // Get the cards without the one just displayed.
    const filteredCards = currRound.cards.filter(card => card !== currRound.cards[0]);
    // Get the card that was just displayed.
    const movingCard = currRound.cards.filter(card => card === currRound.cards[0]);
    setIsFlipped(false);
    setIsActive(true);
    // If this is the last round...
    if (roundNum === 3) {
      // Mark the card as unsuccessful with 'X'.
      setStats([...stats, {
        round: roundNum,
        card: movingCard[0],
        time: 'X'
      }]);
      setAside([...aside, movingCard]);
      setCurrRound({...currRound, cards: filteredCards});
      // ...and it's the last card:
      if (currRound.cards.length === 1) {
        // Finish session.
        setIsFinished(true);
        setIsActive(false);
      }
    // If this is not the last round...
    } else {
      moveCard(filteredCards, movingCard, true);
    }
  }

  return (
    <Container className="session-container">
      {isLoading || error.isError
        ? 
        <div className="preload-message">
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
        </div>
        : 
        <Row>
          {isFinished || !start
          ?
          null
          :
          <Col className="col-1">
            <h4 className="big-n">{aside.length}</h4>
          </Col>}
          <Col className="col-2">
            <Row className="display-row">
              {data.length === 0
              ?
              <Button onClick={() => navigate(`/${d_id}/create_cards`)}
              variant="hp">
                No cards yet, click to add!
              </Button>
              :
              <div>
                {isFinished
                ?
                <SessionFinished data={stats}/>
                :
                !start
                  ?
                  <Button onClick={handleStart} className="start-btn" variant="hp">
                    Start
                  </Button>
                  :
                  <div className="contain-card-display">
                    <h1 className="round-count">
                      Round {currRound.num}
                    </h1>
                    <SessionCards
                    front={currRound.cards[0].frontSVG} isFlipped={isFlipped}
                    back={currRound.cards[0].backSVG} handleFlip={handleFlip}
                    handleAside={handleAside} handleBack={handleBack}/>
                  </div>}
              </div>}
            </Row>
            <Row className="controls-row">
              {isFinished || !start
              ?
              null
              :
              <SessionControls handleAside={handleAside} handleBack={handleBack}
              handleFlip={handleFlip} isFlipped={isFlipped} />
              }
            </Row>
          </Col>
          {isFinished || !start
          ?
          null
          :
          <Col className="col-3">
            <h4 className="big-n">{rn - aside.length}</h4>
          </Col>}
        </Row>}
    </Container>
  )
}