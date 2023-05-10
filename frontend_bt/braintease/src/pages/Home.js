import React from "react";
import Button from "react-bootstrap/Button";
import Container from 'react-bootstrap/Container';
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate } from "react-router-dom";
import kid from "../kid_study.png";
import '../css/Home.css'

export default function Home() {
  
  const navigate = useNavigate();

  return (
    <Container className="hp-cont">
      <Row>
        <Col>
          <img src={kid} alt="kid studying" className="hp-kid"/>
          <div className="hp-pres">
            <h1 className="hp-pres-title">Brain Tease</h1>
            <p className="hp-pres-paragraph">
              This is Brain Tease, a flashcards webapp. You can create
              a deck, give a cover, and add cards to it. After you finish,
              you can the practice whith your cards, and prepare for your
              upcoming tests.
            </p>
            <div className="hp-btn-cont">
              <Button variant="hp" onClick={() => navigate('/decks')}>
                Explore
              </Button>
              <Button variant="hp" onClick={() => navigate('/create_deck')}>
                Create
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  )
}