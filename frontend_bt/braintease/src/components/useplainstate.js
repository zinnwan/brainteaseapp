import {useState, useRef} from 'react';

/**
 *  @description provides a sync useState like
 *    with a plain mutable object as state and a separate render function
 *    to trigger react rerender when wanted.
 *  @example: 
 *    const [state, renderState] = usePlainState({...initialstate});   // const is important, not accidentally overwrite the whole object and lose the 'ref'
 *    state.prop = state.prop++;
 *    ...
 *    renderState();  // or as well: renderState({changedProp:newValue});   // will merge state, not replace it
 *    
 */
export default function usePlainState (initialState) {
  const plainState = useRef(initialState).current;
  let [_,setReactState] = useState(false);
  
  return [
    plainState,         // st
    (newPlainState)=>{  // renderSt()
      if (newPlainState) {
        Object.assign(plainState, newPlainState);  // object.assign no not substitute the plainState object
      }
      setReactState(reactState=>!reactState)  // forceUpdate
    }
  ];
}