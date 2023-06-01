import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial)
  const [history, setHistory] = useState([initial])

  function transition(mode, replace = false) {
    setMode(mode);
    const histCopy = [...history];
    //delete last entry of histCopy if replace is true
    if (replace) {histCopy.pop()}
    setHistory([...histCopy, mode]);
  }

  function back() {
    // create copy of history and remove last ele
    const histCopy = [...history];
    // only evaluates pop() if histCopy > 1
    if (histCopy.length - 1) histCopy.pop();

    // set new history
    setHistory(histCopy);
    setMode(...histCopy.slice(-1));
  }
  
  return { mode, transition, back}
};