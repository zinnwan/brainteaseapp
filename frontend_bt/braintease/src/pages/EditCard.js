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
  const {c_id} = useParams();
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
  const [isError, setIsError] = React.useState(false); // Submit Error.
  const [error, setError] = React.useState({isError: false, message: ''}); // Page Load Error.
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDataPassed, setIsDataPassed] = React.useState(false);
  const alertStyle = {
    width: 'max-content',
    marginTop: 10,
    marginLeft: 40, 
    padding: 5
  };
  const btnStyle =  { 
    marginRight: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center' 
  };

  React.useEffect(() => {
    const getCard = async () => {
      try {
        setIsLoading(true);
        await axios.get(URL.main + URL.c_r_card + d_id)
                    .then(res => {
                      setData(
                        res.data.filter(card => String(card.pk) === c_id)[0]);
                      setIsLoading(false);
                    })
      } catch (err) {
        console.log(err);
        setIsLoading(false);
        setError({isError: true, message: err.message});
      }
    }
    getCard();
  }, [d_id, c_id]);

  React.useEffect(() => {
    if (data.frontJSON !== '') {
      if (!isDataPassed) {
        setOldCanvas({canvas1: data.frontJSON, canvas2: data.backJSON});
        canvas1.current.loadFromJSON(data.frontJSON,
          canvas1.current.renderAll.bind(canvas1.current));
        canvas2.current.loadFromJSON(data.backJSON,
          canvas2.current.renderAll.bind(canvas2.current));
        setIsDataPassed(true);
      } 
    }
  }, [data, isDataPassed, oldCanvas]);

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

  const handleSave = () => {
    let postData
    if (data.title === '') {
      postData = {...data, title: 'Card Title'};
    } else {
      postData = data;
    }

    axios.put(URL.main + URL.u_d_card + c_id, postData)
          .then(res => navigate(-1))
          .catch(err => setIsError(true))
  }

  const handleReset = () => {
    setData(defaultData);
    canvas1.current.clear();
    canvas2.current.clear();
    setOldCanvas(oldCanvas);
  }

  const handleCancel = () => {
    canvas1.current.clear();
    canvas2.current.clear();
    navigate(-1);
  }

  return (
    <Container style={{padding: 10}}>
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
            <i className="fa-solid fa-spinner fa-spin fa-2xl"
              style={{ width: 'max-content', left: '50%' }}></i>
          }
        </Row>
        : <><Row style={{ height: 645 }}>
          <Col onMouseOut={handleCanvasChange}>
            <Editor canvas1={canvas1} canvas2={canvas2} oldCanvas={oldCanvas} />
          </Col>
        </Row>
          <Row className="mt-5">
            <Col xs={8} style={{ justifyContent: 'center', display: 'flex' }}>
              <Form.Group style={{
                display: 'flex',
                width: '70%', alignItems: 'center'
              }}>
                <Form.Label style={{ marginRight: 10, marginBottom: 0 }}>
                  Title
                </Form.Label>
                <Form.Control type="text" value={data.title} 
                onChange={handleFormChange} />
              </Form.Group>
            </Col>
            <Col style={{ display: 'flex', justifyContent: 'space-evenly' }}>
              <Button onClick={handleSave} variant="hp" style={btnStyle}>
                Save
                {svgStyles(icons.save, "margin-left: 5px")}
              </Button>
              <Button onClick={handleReset} variant="hp" style={btnStyle}>
                Reset
                {svgStyles(icons.rotate, "margin-left: 5px")}
              </Button>
              <Button onClick={handleCancel} variant="hp" style={btnStyle}>
                Cancel
                {svgStyles(icons.xMark, "margin-left: 5px")}
              </Button>
            </Col>
          </Row>
          <Row>
            <Col xs={8}></Col>
            <Col>
              {isError && <Alert variant="danger" style={alertStyle}>
                There seems to be a problem, try again.
              </Alert>}
            </Col>
          </Row></>}
    </Container>
  )
}
