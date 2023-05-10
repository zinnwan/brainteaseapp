import React from "react";
import Editor from "../components/editor/Editor";
import axios from "axios";
import { URL } from '../constants/API_URL';
import { useParams, useNavigate } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { icons } from "../icons";
import { svgStyles } from "../utils";

export default function AddCards() {

  const canvas1 = React.useRef(null);
  const canvas2 = React.useRef(null);
  const [oldCanvas, setOldCanvas] = React.useState({canvas1: '', canvas2: ''});
  const {d_id} = useParams();
  const navigate = useNavigate();
  const defaultData = {
    title: '',
    deck: d_id,
    frontJSON: '',
    frontSVG: '',
    backJSON: '',
    backSVG: ''
  };
  const [data, setData] = React.useState(defaultData);
  const [cardCount, setCardCount] = React.useState(1);
  const [addStatus, setAddStatus] = React.useState(icons.plus);
  const [addBtnVar, setAddBtnVar] = React.useState('hp');
  const [isError, setIsError] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [canvasTemp, setCanvasTemp] = React.useState(undefined);
  const alertStyle = {
    width: 'max-content',
    marginTop: 10,
    marginLeft: 40, 
    padding: 5};

  const handleCanvasChange = () => {
    setData({
      ...data,
      frontJSON: canvas1.current.toJSON(),
      frontSVG: canvas1.current.toSVG({suppressPreamble: true}),
      backJSON: canvas2.current.toJSON(),
      backSVG: canvas2.current.toSVG({suppressPreamble: true})
    });
  }

  const handleFormChange = (e) => {
    setData({...data, title: e.target.value});
  }

  const handleAddCard = () => {
    let postData
    if (data.title === '') {
      postData = {...data, title: 'Card ' + cardCount};
    } else {
      postData = data;
    }
    axios.post(URL.main + URL.c_r_card + d_id, postData)
        .then(res => {
          setIsError(false);
          setAddStatus(icons.checkMark);
          setAddBtnVar('success');
          setIsSuccess(true);
          setTimeout(() => {
            setAddStatus(icons.plus);
            setAddBtnVar('hp');
            setIsSuccess(false);
          }, 1500);
          setData(defaultData);
          handleReset();
          setCardCount(cardCount + 1);
        })
        .catch(err => {
          // console.log(err);
          setIsError(true);
          setAddBtnVar('danger');
          setAddStatus(icons.xMark);
          setTimeout(() => {
            setAddStatus(icons.plus);
            setAddBtnVar('hp');
          }, 1200);
        });
  }

  const handleReset = () => {
    setData(defaultData);
    canvas1.current.clear();
    canvas2.current.clear();
    if (canvasTemp !== undefined) {
      canvas1.current.loadFromJSON(canvasTemp.canvas1,
        canvas1.current.renderAll.bind(canvas1.current));
      canvas2.current.loadFromJSON(canvasTemp.canvas2,
        canvas2.current.renderAll.bind(canvas2.current));
    }
    setOldCanvas(oldCanvas);
  }

  const handleTemplateSet = () => {
    setCanvasTemp({
      canvas1: canvas1.current.toJSON(),
      canvas2: canvas2.current.toJSON()
    });
  }

  return (
    <Container style={{padding: 10}}>
      <Row style={{height: 645}}>
        <Col onMouseOut={handleCanvasChange}>
          <Editor canvas1={canvas1} canvas2={canvas2} oldCanvas={oldCanvas} />
        </Col>
      </Row>
      <Row className="mt-5">
        <Col xs={8} style={{justifyContent: 'center', display: 'flex'}}>
          <Form.Group style={{display: 'flex', 
          width: '70%', alignItems: 'center'}}>
            <Form.Label style={{marginRight: 10, marginBottom: 0}}>
              Title
            </Form.Label>
            <Form.Control type="text" placeholder={`Card ${cardCount}`}
            value={data.title} onChange={handleFormChange}/>
          </Form.Group>
        </Col>
        <Col style={{display: 'flex', justifyContent: 'space-evenly'}}>
          <Button onClick={handleAddCard} variant={addBtnVar}
          style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            Add
            {svgStyles(addStatus, "margin-left: 5px")}
          </Button>
          <Button onClick={handleTemplateSet} variant="hp"
          style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            Set Cast
            {svgStyles(icons.star,
              `opacity: ${canvasTemp === undefined? 0.5 : 1}; margin-left: 5px`)}
          </Button>
          <Button onClick={handleReset} variant="hp"
          style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            Reset
            {svgStyles(icons.rotate, "margin-left: 5px")}
          </Button>
          <Button onClick={() => navigate(`/${d_id}/cards`)} variant="hp"
          style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            Done
            {svgStyles(icons.checkMark, "margin-left: 5px")}
          </Button>
        </Col>
      </Row>
      <Row>
        <Col xs={8}></Col>
        <Col>
          {isSuccess && <Alert variant="success" style={alertStyle}>
            Your card has been added!
          </Alert>}
          {isError && <Alert variant="danger" style={alertStyle}>
            There seems to be a problem, try again.
          </Alert>}
        </Col>
      </Row>
    </Container>
  )
}