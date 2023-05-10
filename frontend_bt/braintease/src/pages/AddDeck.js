import React from "react";
import Editor from '../components/editor/Editor';
import axios from "axios";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { URL } from '../constants/API_URL';
import { useNavigate } from "react-router-dom";
import { icons } from "../icons";
import { svgStyles } from "../utils";
import '../css/AddDeck.css';

export default function AddDeck() {
  
  const navigate = useNavigate();
  const defaultData = {
    name: '',
    description: '',
    coverJSON: '',
    coverSVG: ''
  };
  const [data, setData] = React.useState(defaultData);
  const [isError, setIsError] = React.useState(false);
  const canvas1 = React.useRef(null);
  const [oldCanvas, setOldCanvas] = React.useState({canvas1: '', canvas2: ''});

  const handleCanvasChange = () => {
    setData({
      ...data,
      coverJSON: canvas1.current.toJSON(),
      coverSVG: canvas1.current.toSVG({suppressPreamble: true})
    });
  }

  const handleSubmit = (e) => {
    let postData;
    if (data.name === '') {
      postData = {...data, name: 'Unamed Deck'}
    } else {
      postData = data
    }

    axios.post(URL.main + URL.c_r_deck, postData)
        .then(res => {
          console.log(res.statusText);
          axios.get(URL.main + URL.c_r_deck)
              .then(res => 
                navigate(`/${res.data[res.data.length-1].pk}/create_cards`))
        })
        .catch(err => {
          console.log(err.message)
          if (err.message === 'Network Error') {
            setIsError(true);
          }
        });
  }

  const handleReset = () => {
    canvas1.current.clear();
    setData(defaultData);
    setOldCanvas(oldCanvas);
  }

  const handleCancel = () => {
    canvas1.current.clear();
    setData(defaultData);
    navigate('/');
  }

  return (
    <Container style={{marginLeft: '5%', marginTop: '2%'}}>
      <Row>
        <Col onMouseOut={handleCanvasChange}>
          <Editor canvas1={canvas1} canvas2={null} oldCanvas={oldCanvas}/>
        </Col>
        <Col>
          <h1>Information</h1>
          <Form noValidate style={{width: 400}}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" placeholder="Your deck name" 
              value={data.name} required={true}
              onChange={(e) => setData({...data, name: e.target.value})}/>
            </Form.Group>
            <Form.Group className="mb-5">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" placeholder="Description" rows={4} 
              value={data.description}
              onChange={(e) => setData({...data, description: e.target.value})}/>
            </Form.Group>
            <div className="aD-btn-cont">
              <Button className="aD-btn" onClick={handleSubmit}
              variant="hp">
                Add
                {svgStyles(icons.plus, "margin-left: 5px")}
              </Button>
              <Button className="aD-btn" onClick={handleReset}
              variant="hp">
                Reset
                {svgStyles(icons.rotate, "margin-left: 5px")}
              </Button>
              <Button className="aD-btn" onClick={handleCancel}
              variant="hp">
                Cancel
                {svgStyles(icons.xMark, "margin-left: 5px")}
              </Button>
              {isError && <Alert className="mt-3" variant="danger"
                style={{ width: 'max-content' }}>
                There seems to be a problem with your network
                {icons.noWifi}
              </Alert>}
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}