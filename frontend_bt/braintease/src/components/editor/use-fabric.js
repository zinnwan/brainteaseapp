import React from 'react'
const fabric = require('fabric').fabric

export default function useFabric(canvas) {
    const fabricRef = React.useCallback((element) => {
      if (!element) return canvas.current?.dispose();
  
      canvas.current = new fabric.Canvas(element, {backgroundColor: 'white'});
    }, [canvas]);
    return fabricRef;
  };