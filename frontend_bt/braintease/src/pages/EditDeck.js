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
import { useNavigate, useParams } from "react-router-dom";
import { icons } from "../icons";
import { svgStyles } from "../utils";
import '../css/EditDeck.css';

export default function AddDeck() {
  
  const navigate = useNavigate();
  const {d_id} = useParams();
  const defaultData = {
    name: '',
    description: '',
    coverJSON: '',
    coverSVG: ''
  };
  const [isDataPassed, setIsDataPassed] = React.useState(false);
  const [data, setData] = React.useState(defaultData);
  const [error, setError] = React.useState({isError: false, message: ''});
  const [isSubErr, setIsSubErr] = React.useState(false);
  const canvas1 = React.useRef(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [oldCanvas, setOldCanvas] = React.useState({canvas1: '', canvas2: ''});
  const iconCss = "margin-left: 8px";

  React.useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        await axios.get(URL.main + URL.c_r_deck)
                    .then(res => {
                      setData(
                        res.data.filter(deck => String(deck.pk) === d_id)[0]);
                      setIsLoading(false);
                      setIsSubErr(false);
                    })
      } catch (err) {
        // console.log(err)
        setError({isError: true, message: err.message});
      }
    }

    getData();
  }, [d_id]);

  React.useEffect(() => {
    if (data.coverJSON !== '') {
      if (!isDataPassed) {
        setOldCanvas({...oldCanvas, canvas1: data.coverJSON});
        canvas1.current.loadFromJSON(data.coverJSON,
          canvas1.current.renderAll.bind(canvas1.current));
        setIsDataPassed(true);
      } 
    }
  }, [data, isDataPassed, oldCanvas]);

  const handleCanvasChange = () => {
    // console.log(canvas1.current)
    setData({
      ...data,
      coverJSON: canvas1.current.toJSON(),
      coverSVG: canvas1.current.toSVG({suppressPreamble: true})
    });
  }

  const handleSubmit = (e) => {
    let postData;
    if (data.name === '') {
      postData = {...data, name: 'Unamed Deck'};
    } else {
      postData = data;
    }

    const update = async () => {
      try {
        await axios.put(URL.main + URL.u_d_deck + d_id, postData)
                    .then(res => navigate(-1))
      } catch (err) {
        console.log(err)
        setIsSubErr(true);
      }
    }
    update();
  }

  const handleReset = () => {
    canvas1.current.clear();
    setData(defaultData);
  }

  const handleCancel = () => {
    canvas1.current.clear();
    navigate(-1);
  }

  // console.log(error.isError);

  return (
    <Container style={{marginLeft: '5%', marginTop: '2%'}}>
      {isLoading || error.isError
        ? <Row>
          {
            error.isError &&
            <Alert variant="danger" className="error-message">
              You seem to have a "{error.message}" problem
              {error.message === "Network Problem" ? icons.noWifi : null}
            </Alert>
          }
          {
            (isLoading && !error.isError) &&
            <i className="fa-solid fa-spinner fa-spin fa-2xl"
              style={{ width: 'max-content', left: '50%' }}></i>
          }
        </Row>
        : <Row>
          <Col onMouseOut={handleCanvasChange}>
            <Editor canvas1={canvas1} canvas2={null} oldCanvas={oldCanvas} />
          </Col>
          <Col>
            <h1>Information</h1>
            <Form noValidate style={{ width: 400 }}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Your deck name"
                  value={data.name} required={true}
                  onChange={(e) => setData({ ...data, name: e.target.value })} />
              </Form.Group>
              <Form.Group className="mb-5">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" placeholder="Description" rows={4}
                  value={data.description}
                  onChange={(e) => setData({ ...data, description: e.target.value })} />
              </Form.Group>
              <div className="eD-btn-cont">
                <Button className="eD-btn" onClick={handleSubmit} variant="hp">
                  Save
                  {svgStyles(icons.save, iconCss)}
                </Button>
                <Button className="eD-btn" onClick={handleReset} variant="hp">
                  Reset
                  {svgStyles(icons.rotate, iconCss)}
                </Button>
                <Button className="eD-btn" onClick={handleCancel} variant="hp">
                  Cancel
                  {svgStyles(icons.xMark, iconCss)}
                </Button>
                {isSubErr && <Alert className="mt-3" variant="danger"
                  style={{ width: 'max-content' }}>
                  There seems to be a problem with your network
                  {svgStyles(icons.noWifi, "margin-left: 5px")}
                </Alert>}
              </div>
            </Form>
          </Col>
        </Row>}
    </Container>
  )
}