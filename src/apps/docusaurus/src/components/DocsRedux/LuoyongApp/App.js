import store from './store'
import { useEffect, useState } from 'react'
import Tips from './compnents/Tips'

export default () => {
  useEffect(() => {
    store.subscribe(() => {
      setMsg(store.getState().msg);
    })
  }, [])
  const [msg, setMsg] = useState(store.getState().msg);
  return (
    <div className="App">
      <Tips />
      <div>{msg}</div>
    </div>
  );
}