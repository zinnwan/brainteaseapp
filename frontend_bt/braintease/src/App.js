import React from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import AddDeck from './pages/AddDeck';
import DeckList from './pages/DeckList';
import CardsList from './pages/CardsList';
import AddCards from './pages/AddCards';
import EditCard from './pages/EditCard';
import EditDeck from './pages/EditDeck';
import Session from './pages/Session';
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function App() {

  const location = useLocation();
  const navigate = useNavigate();
  const homeActive = location.pathname === '/';
  const createActive = location.pathname === '/create_deck';
  const exploreActive = location.pathname === '/decks';

  return (
    <>
    <Navbar style={{backgroundColor: '#6d79bf'}}>
      <Container style={{width: 'max-content'}}>
        <h5 className='navbrandx'
        onClick={() => navigate('/')}>
          Brain Tease
        </h5>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='navbarx'>
            <Nav.Link as='div' className="nav-item" >
              {' '}
              <Link className='text-decoration-none text-light' to='/'>
                Home
              </Link>
              {homeActive && <div className='nav-location'></div>}
            </Nav.Link>
            <Nav.Link as='div' className="nav-item" >
              {' '}
              <Link className='text-decoration-none text-light' to='/create_deck'>
                Create
              </Link>
              {createActive && <div className='nav-location'></div>}
            </Nav.Link>
            <Nav.Link as='div' className="nav-item" >
              {' '}
              <Link className='text-decoration-none text-light' to='/decks'>
                Explore
              </Link>
              {exploreActive && <div className='nav-location'></div>}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar> 

    <style type="text/css">
        {`
        .btn-hp {
          background-color: #fad14b;
          border-radius: 15px;
        }
        .btn-hp:hover {
          background-color: #deb943;
        }
        `}
    </style> 

    <Routes>
      <Route path='/' element={<Home />}/>
      <Route path='/create_deck' element={<AddDeck />}/>
      <Route path='/:d_id/create_cards' element={<AddCards />}/>
      <Route path='/decks' element={<DeckList />}/>
      <Route path="/:d_id/cards" element={<CardsList />}/>
      <Route path="/:d_id/edit_deck" element={<EditDeck />}/>
      <Route path="/:d_id/:c_id/edit_card" element={<EditCard />}/>
      <Route path="/:d_id/session" element={<Session />}/>
    </Routes>
    </>
  );
}

export default App;
