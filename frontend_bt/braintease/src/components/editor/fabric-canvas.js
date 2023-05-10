import React from 'react'
import useFabric from './use-fabric';


export default function FabricCanvas(props) {
    const {canvas} = props;
    const fabricRef = useFabric(canvas);
    return <canvas ref={fabricRef} width={400} height={550} />;
  }