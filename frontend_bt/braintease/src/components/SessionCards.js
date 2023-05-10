import React from 'react';
import SVG from './SVG';
import { CSSTransition } from 'react-transition-group';
import '../css/SessionCards.css'

export default function SessionCards({
  front,
  back,
  isFlipped,
  handleFlip,
  handleAside,
  handleBack
}) {

  const nodeRef = React.useRef();

  return (
    <div className='container-flip-card'>
      <CSSTransition
        in={!isFlipped}
        timeout={500}
        nodeRef={nodeRef}
        classNames={'flip'}
      >
        <div className='session-card' ref={nodeRef}>
          <div className='session-front side' onClick={handleFlip}>
            <SVG svg={front} />
          </div>
          <div className='session-back side'>
            <div className='card-control left' onClick={handleAside}></div>
            <div className='card-control right' onClick={handleBack}></div>
            <SVG svg={back} />
          </div>
        </div>
      </CSSTransition>
    </div>
  );
}