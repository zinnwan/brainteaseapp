import React from "react";
import FabricCanvas from "./fabric-canvas";
import { rect, text, ellip } from "./objects";
import { icons } from "../../icons";
import { svgStyles } from "../../utils";
import './Editor.css';
const fabric = require('fabric').fabric;

export default function Editor({ canvas1, canvas2, oldCanvas }) {

  const isCanvas2 = canvas2 !== null;
  const isOldCanvas1 = oldCanvas.canvas1 !== '';
  const isOldCanvas2 = oldCanvas.canvas2 !== '';
  const [isCanvasLoaded, setIsCanvasLoaded] = React.useState(false);
  const [canvas, setCanvas] = React.useState(canvas1.current);
  const isCanvas = canvas !== null;
  const [isFired, setIsFired] = React.useState(false);
  const [tool, setTool] = React.useState('select');
  const tools = [
    {name: 'select', icon: svgStyles(icons.cursor, "width: 25px; height: 25px")},
    {name: 'rect', icon: <div className="rect-tool-icon"></div>},
    {name: 'ellip', icon: <div className="ellip-tool-icon"></div>},
    {name: 'text', icon: svgStyles(icons.tText, "width: 25px; height: 25px")}
  ];
  const [id, setId] = React.useState(0);
  const [fillColor, setFillColor] = React.useState('red');
  const [strokeColor, setStrokeColor] = React.useState('black');
  const [strokeWidth, setStrokeWidth] = React.useState(0);
  const strokeStyles = ['solid', 'dashed', 'dotted'];
  const strokeStyleVal = [[], [5, 15], [0.5, 8]];
  const [strokeStyle, setStrokeStyle] = React.useState([]) ;
  const [opacity, setOpacity] = React.useState(1);
  const [fontFamily, setFontFamily] = React.useState('arial');
  const [fontWeight, setFontWeight] = React.useState(false);
  const [fontSize, setFontSize] = React.useState(20);
  const alignments = [
    {name: "left", icon: icons.textLeft},
    {name: "center", icon: icons.textCenter},
    {name: "right", icon: icons.textRight}
  ];
  const [textAlign, setTextAlign] = React.useState('left');
  const sizes = [20, 40, 60];
  const [sizeCount, setSizeCount] = React.useState(1);
  const fonts = ['arial', 'monospace', 'handmade'];
  const [fontCount, setFontCount] = React.useState(1)
  const [roundness, setRoundness] = React.useState(0);
  const colorSet = ['#14b927', '#0026ed', '#5500ed','#ed0000',
   '#ed7b00', '#eded00', 'transparent'];
  const [isSelection, setIsSelection] = React.useState(false);
  const [isTextSel, setIsTextSel] = React.useState(false);
  const [isRectSel, setIsRectSel] = React.useState(false);
  const [bgColor1, setBgColor1] = React.useState('#ffffff');
  const [bgColor2, setBgColor2] = React.useState('#ffffff');
  const [isMuseDown, setIsMouseDown] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Delete') {
        canvas.getActiveObjects().map(obj => {
          return canvas.remove(obj);
        });
        setTool('select');
        canvas.discardActiveObject();
      } else if (e.key === 'Escape') {
        canvas.discardActiveObject();
        setTool('select');
      }
    }

    if (isCanvas) {
      document.addEventListener('keydown', handleKeyDown);

      if (canvas === canvas1.current) {
        canvas.setBackgroundColor(bgColor1,
          canvas.renderAll.bind(canvas));
      } else if (isCanvas2) {
        canvas2.current.setBackgroundColor(bgColor2,
          canvas.renderAll.bind(canvas));
      }

      const objs = canvas.getActiveObjects().length
      if (isSelection) {
        if (objs > 1) {
          return;
        } else if (objs === 1){
          const obj = canvas.getActiveObject()
          obj.set('fill', fillColor);
          obj.set('stroke', strokeColor);
          obj.set('strokeWidth', parseInt(strokeWidth));
          obj.set('strokeDashArray', strokeStyle);
          obj.set('opacity', opacity);
          if (obj.type === 'i-text') {
            obj.set('fontFamily', fontFamily);
            obj.set('fontSize', fontSize);
            obj.set('textAlign', textAlign);
            if (fontWeight) {
              obj.set('fontWeight', 'bold');
            } else {
              obj.set('fontWeight', '');
            }
          }
          if (obj.type === 'rect') {
            obj.set('rx', roundness).set('ry', roundness);
          }
        }
        canvas.renderAll();
      }
    }
    
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSelection, fillColor, strokeColor, strokeWidth, strokeStyle, opacity,
  fontFamily, fontWeight, fontSize, roundness, textAlign, canvas, bgColor1, 
  bgColor2, isCanvas, isCanvas2 , canvas1, canvas2]);

  const handleCanvasClick = (e) => {
    if (isCanvas2) {
      if (e.target.parentElement.parentElement.id === 'canvas2') {
        setCanvas(canvas2.current);
        canvas1.current.discardActiveObject();
      } else {
        setCanvas(canvas1.current);
        canvas2.current.discardActiveObject();
      }
    }

    const x = e.clientX - canvas._offset.left;
    const y = e.clientY - canvas._offset.top;
    
    switch (tool) {
      case 'text':
        canvas.add(new fabric.IText('Text', {
          ...text,
          top: y - 35,
          left: x - 50,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: parseInt(strokeWidth),
          strokeDashArray: strokeStyle,
          opacity: opacity,
          fontFamily: fontFamily,
          fontWeight: (fontWeight)? "bold" : '',
          fontSize: fontSize,
          textAlign: textAlign,
          id: id,
        }));
        const Objs = canvas.getObjects();
        Objs[Objs.length-1].setControlsVisibility({
          mb: false,
          mt: false,
          mr: false,
          ml: false,
        });
        setId(id + 1);
        break

      case 'ellip':
        canvas.add(new fabric.Ellipse({
          ...ellip,
          top: y - 50,
          left: x - 50,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: parseInt(strokeWidth),
          strokeDashArray: strokeStyle,
          opacity: opacity,
          id: id,
        }));
        setId(id + 1);
        break

      default:
        break
    }
    setTool('select');

    const actObjs = canvas.getActiveObjects();
    if (actObjs.length > 1) {
      setIsSelection(true);
    } else if (actObjs.length === 1) {
      setIsSelection(true);
      const actObj = canvas.getActiveObject()
      setFillColor(actObj.fill);
      setStrokeColor(actObj.stroke);
      setStrokeWidth(actObj.strokeWidth);
      setStrokeStyle(actObj.strokeDashArray);
      setOpacity(actObj.opacity);

      if (actObj.type === 'i-text') {
        setIsTextSel(true);
        setFontFamily(actObj.fontFamily);
        setFontSize(actObj.fontSize);
        setTextAlign(actObj.textAlign);
        if (actObj.fontWeight === 'bold') {
          setFontWeight(true);
        } else {
          setFontWeight(false);
        }
      } else {
        setIsTextSel(false);
      }

      if (actObj.type === 'rect') {
        setIsRectSel(true);
        setRoundness(actObj.rx);
      } else {
        setIsRectSel(false);
      }
    } else {
      setIsSelection(false);
      setIsTextSel(false);
      setIsRectSel(false);
    }
  }

  const handleImgClick = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const img = evt.target.result;
      fabric.Image.fromURL(img, (img) => {
        img.scaleToWidth(150);
        img.set('id', id);
        canvas.add(img);
        });
        setId(id + 1);
    }
    reader.readAsDataURL(file);
    
  }

  const handleMouseDown = (e) => {
    if (isCanvas) {
      const x = e.clientX - canvas._offset.left
      const y = e.clientY - canvas._offset.top
      setIsMouseDown(true)
      if (tool === 'rect') {
        canvas.set('selection', false);
        canvas.add(new fabric.Rect({
          ...rect,
          top: y,
          left: x,
          fill: fillColor,
          stroke: strokeColor,
          strokeWidth: parseInt(strokeWidth),
          strokeDashArray: strokeStyle,
          opacity: opacity,
          rx: roundness,
          ry: roundness,
          id: id,
        }));
        setId(id + 1);
      } 
    }
  }

  const handleMouseMove = (e) => {
    
    if (isMuseDown === true) {
      if (tool === 'rect') {
        const x = e.clientX - canvas._offset.left;
        const y = e.clientY - canvas._offset.top;
        const objs = canvas.getObjects();
        const obj = objs[objs.length-1];
        obj.set('width', x - obj.left).set('height', y - obj.top);
        canvas.renderAll();
      } 
    }
  }

  const handleMouseUp = () => {
    if (isCanvas) {
      setIsMouseDown(false);
      canvas.set('selection', true);
    }
  }

  const changeBgColor = (e) => {
    if (canvas === canvas1.current) {
      setBgColor1(e.target.value);
    } else {
      setBgColor2(e.target.value);
    }
  }

  const handleObjectCopy = () => {
    if (canvas.getActiveObject() !== null) {
      canvas.getActiveObject().clone(function(cloned) {
        canvas._clipboard = cloned;
      });
      canvas._clipboard.clone(function(clonedObj) {
        canvas.discardActiveObject();
        clonedObj.set({
          left: clonedObj.left + 20,
          top: clonedObj.top + 20,
          evented: true,
        });
        if (clonedObj.type === 'activeSelection') {
          clonedObj.canvas = canvas;
          clonedObj.forEachObject(function(obj) {
            canvas.add(obj);
          });
          clonedObj.setCoords();
        } else {
          canvas.add(clonedObj);
        }
        canvas._clipboard.top += 20;
        canvas._clipboard.left += 20;
        canvas.setActiveObject(clonedObj);
        canvas.requestRenderAll();
      });
    }
  }


  if (isOldCanvas1) {
    if (!isCanvasLoaded) {
      if (canvas !== null) {
        setBgColor1(oldCanvas.canvas1.background);
        if (isOldCanvas2) {setBgColor2(oldCanvas.canvas2.background)}
        setIsCanvasLoaded(true);
      }
    }
  }

  return (
    <div id="body-editor" style={{width: (isCanvas2)? 1200 : 800, 
    gridTemplateColumns: (isCanvas2)? '25% 75%' : '35% 65%'}}
    onMouseOver={() => {
      if (!isFired) {
        setCanvas(canvas1.current);
        setIsFired(true);
      }
    }}>
      <div id="tools">
        <div id="tool-bar" >
          {tools.map((t, i) => {
            return (
              <div key={t.name} className="tool-box" style={{
                backgroundColor: (tool === t.name)? '#ededed' : 'transparent',
              }}>
                {t.icon}
                <input id={t.name} type='radio' value={t.name} className='tool' 
                checked={tool === t.name} onClick={() => setTool(t.name)} 
                onChange={() => null} />
              </div>
              )
            })}
          <div className="tool-box">
            {svgStyles(icons.image, "width: 25px; height: 25px")}
            <input type='file' accept="image/*" id="import-img"
            onChange={handleImgClick}/>
          </div>
          <div id="bg-color" className="color-picker"
          style={{backgroundColor:(isCanvas)?canvas.backgroundColor:bgColor1}}>
            <input type="color" className="input-color" value={bgColor1}
            onChange={changeBgColor}/>
          </div>
        </div>
        {(tool !== 'select' ||  isSelection) && 
        <div id="props">
          <section>
            <p className="prop-sections">Fill Color</p>
            <div className="color-set">
              <div className="color-picker" 
                style={{backgroundColor: fillColor}}>
                  <input type="color" className="input-color" 
                  onChange={(e) => setFillColor(e.target.value)}/>
              </div>
              {colorSet.map((color, i) => {
                return (
                  <button key={i} className="color-set" id={color}
                  style={{backgroundColor: color}}
                  onClick={() => {
                    setFillColor(color)
                  }} ></button>)
              })}
            </div>
          </section>
          <section>
            <p className="prop-sections">Stroke Color</p>
            <div className="color-set">
              <div className="color-picker" 
              style={{backgroundColor: strokeColor}}>
                <input type="color" className="input-color" 
                onChange={(e) => setStrokeColor(e.target.value)}/>
              </div>
              {colorSet.map((color, i) => {
                return (
                  <button key={i} className="color-set" id={color}
                  style={{backgroundColor: color}}
                  onClick={() => setStrokeColor(color)} ></button>)
              })}
            </div>
          </section>
          <section>
            <p className="prop-sections">Stroke Width</p>
            <input type="range" min="0.5" max="10" value={strokeWidth} 
            className="range" step="0.5" 
            onChange={(e) => setStrokeWidth(e.target.value)} />
          </section>
          <section>
            <p className="prop-sections">Stroke Style</p>
            <div id="radio-container">
            {strokeStyles.map((style, i) => {
              const checked = JSON.stringify(strokeStyle) === 
              JSON.stringify(strokeStyleVal[i]);
              return (
                <div key={style} className="strk-style-box"
                style={{backgroundColor: (checked)?'grey':'white'}}>
                  <div className="inner-box" id={style}></div>
                  <input className="stroke-style" id={style} type="radio"
                  checked={checked}
                  value={style} onChange={() => null}
                    onClick={() => setStrokeStyle(strokeStyleVal[i])}/>
                </div>)
            })}
            </div>
          </section>
          <section>
            <p className="prop-sections">Opacity</p>
            <input type="range" min="0" max="1" value={opacity} 
            className="range" step="0.1" 
            onChange={(e) => setOpacity(e.target.value)} />
          </section>
          {(isTextSel || (tool === 'text')) && <section>
            <p className="prop-sections">Text Style</p>
            <div id="ft" >
              <button style={{fontFamily: fontFamily}} onClick={() => {
                if (fontCount === 2) {
                  setFontCount(0);
                  setFontFamily(fonts[fontCount]);
                } else {
                  setFontCount(fontCount + 1);
                  setFontFamily(fonts[fontCount]);
                }
              }} id="font-change" className="font-btn">F</button>
              <button id="bold" onClick={() => setFontWeight(!fontWeight)}
              className="font-btn" style={{fontWeight: (fontWeight)? 'bolder':
              "normal"}}>B</button>
              <button  onClick={() => {
              if (sizeCount === 2) {
                setSizeCount(0);
                setFontSize(sizes[sizeCount]);
              } else {
                setSizeCount(sizeCount + 1);
                setFontSize(sizes[sizeCount]);
              }
              }} id="size-change" className="font-btn">{fontSize}</button>
            </div>
            <div id="text-align-box">
            {alignments.map((align, i) => {
              return (
                <label key={align.name} className="align-label"
                style={{backgroundColor: (align.name === textAlign)?
                  '#ededed' : 'white'}}>
                  {svgStyles(align.icon, "width: 25px; height: 25px")}
                  <input className="text-align" id={align.name} type="radio"
                  checked={textAlign === align.name}
                  value={align.name} onChange={() => null}
                  onClick={() => setTextAlign(align.name)}/>
                </label>);
            })}
            </div>
          </section>}
          {(isRectSel || tool === 'rect') && <section>
            <p className="prop-sections">Corner Roundness</p>
            <input type="range" min="0" max="30" value={roundness} 
            className="range" step="1" 
            onChange={(e) => setRoundness(e.target.value)} />
          </section>}
          <section>
            <p className="prop-sections">Actions</p>
            <div id="actions-1">
              <div className="actions">
                {icons.groupObjects}
                <button onClick={() => {
                  if (canvas.getActiveObject() !== undefined) {
                    if (canvas.getActiveObject().type === 'activeSelection') {
                      canvas.getActiveObject().toGroup();
                    } else {
                      return;
                    }
                  }
                }}
                id="group"></button>
              </div>
              <div className="actions">
                {icons.ungroupObjects}
                <button onClick={() => {
                  if (canvas.getActiveObject() !== undefined) {
                    if (canvas.getActiveObject().type === 'group') {
                      canvas.getActiveObject().toActiveSelection();
                    } else {
                      return;
                    }
                  }
                }}
                id="ungroup"></button>
              </div>
              <div className="actions">
                {icons.trash}
                <button onClick={() => canvas.getActiveObjects().map(obj => {
                  return canvas.remove(obj);
                })} id="remove"></button>
              </div>
              <div className="actions">
                {svgStyles(icons.cloneObjects, "width: 16px; height: 16px")}
                <button onClick={handleObjectCopy} id="copy"></button>
              </div>
            </div>
            <div id="actions-2">
              <div className="actions">
                {icons.moveForward}
                <button onClick={() => canvas.getActiveObjects().map(obj => {
                  return canvas.bringForward(obj);
                })} id="bring-forward"></button>
              </div>
              <div className="actions">
                {icons.bringToFront}
                <button onClick={() => canvas.getActiveObjects().map(obj => {
                  return canvas.bringToFront(obj);
                })} id="send-to-front"></button>
              </div>
              <div className="actions">
                {icons.moveBackward}
                <button onClick={() => canvas.getActiveObjects().map(obj => {
                  return canvas.sendBackwards(obj);
                })} id="send-backward"></button>
              </div>
              <div className="actions">
                {icons.bringToBack}
                <button onClick={() => canvas.getActiveObjects().map(obj => {
                  return canvas.sendToBack(obj);
                })} id="send-to-back"></button>
              </div>
            </div>
          </section>
        </div>}
      </div>
      <div id="workplace" style={{gridTemplateColumns: (isCanvas2)?'50% 50%':'100%'}}>
        <div id="workplace-col1" className="workplace-col">
          <h1 className="canvas-title"
            style={{opacity: (canvas===canvas1.current)?1:0.5}}
          >{(isCanvas2)?'Front':'Cover'}</h1>
          <div id="canvas1" className="canvas-container" 
          onClick={handleCanvasClick} onMouseDown={handleMouseDown} 
          onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
            <FabricCanvas canvas={canvas1}/>
          </div>
        </div>
        {isCanvas2 && 
        <div id="workplace-col2" className="workplace-col">
          <h1 className="canvas-title" 
          style={{opacity: (canvas===canvas2.current)?1:0.5}}
          >Back</h1>
          <div id="canvas2" className="canvas-container" 
          onClick={handleCanvasClick} onMouseDown={handleMouseDown} 
          onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
            <FabricCanvas canvas={canvas2} />
          </div>
        </div>}
      </div>
    </div>
  )
}
