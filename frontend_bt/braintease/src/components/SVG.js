import React from 'react';
import parse from 'html-react-parser';
import { resize } from '../utils';

export default function SVG({ svg, size }) {

  const sizes = {
    s: {width: 150, height: 206.25, bR: 8},
    m: {width: 300, height: 412.5, bR: 10},
    l: {width: 400, height: 550, bR: 12}
  }

  let currSize
  if (size === 's') {
    currSize = sizes.s
  } else if (size === 'm') {
    currSize = sizes.m
  } else {
    currSize = sizes.l
  }

  const style = {
    width: currSize.width-5,
    height: currSize.height-5,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: currSize.bR,
    overflow: 'hidden',
    margin: 3,
    cursor: 'pointer',
    userSelect: 'none'
  };

  const div = document.createElement('div');
  div.innerHTML = svg;
  const svgEl = div.firstChild;
  svgEl.style.flexShrink = 0;
  const svgStr = svgEl.outerHTML;
    
  const cardSide = parse(svgStr, resize(currSize.width, currSize.height))

  return (
    <div style={style}>
      {cardSide}
    </div>
  );
}