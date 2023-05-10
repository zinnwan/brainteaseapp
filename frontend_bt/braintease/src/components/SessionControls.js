import React from 'react';
import Button from 'react-bootstrap/Button';

export default function SessionControls({handleAside, handleBack, handleFlip, isFlipped}) {

    return (
        <div>
          {isFlipped
            ? <div>
              <Button onClick={handleAside} variant="hp"
              className='flipped-btn aside-btn'>Put Card Aside</Button>
              <Button onClick={handleBack} variant="hp"
              className='flipped-btn back-btn'>Put Card Back</Button>
            </div>
            : <Button onClick={handleFlip} id="start" variant="hp"
            className='flip-btn'>Flip Card</Button>}
        </div>
    );
}