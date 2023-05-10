import parse from 'html-react-parser';
import { renderToStaticMarkup } from 'react-dom/server'

export function resize(w, h) {
    const resizeOpts = {
      replace: (domNode) => {
        if (domNode.attribs) {
          if ('xmlns' in domNode.attribs) {
            domNode.attribs.height = h
            domNode.attribs.width = w
          }
        }
      },
    };
    return resizeOpts;
  }


export function getSet(list) {
  // From a list of numbers, extract a set.
  const newList = []
  list.map(item => {
    if (!newList.includes(item)) {
      newList.push(item);
    }
    return newList;
  })
  return newList;
}

export function shuffle(list) {
  const newList = [];
	while (newList.length !== list.length) {
    const i = list[Math.floor(Math.random()*list.length)]
		if (!newList.includes(i)) {
      newList.push(i);
    }
  }
	return newList;
}

export function svgStyles(svg, objStr) {
  const svgStr = renderToStaticMarkup(svg);
  const div = document.createElement('div');
  div.innerHTML = svgStr;
  const svgEl = div.firstChild;
  svgEl.setAttribute('style', objStr);
  const svgJsx = parse(svgEl.outerHTML);
  return svgJsx;
}