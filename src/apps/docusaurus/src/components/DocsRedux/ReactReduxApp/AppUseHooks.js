import Tips from './compnents/TipsUseHooks'
import { useSelector } from 'react-redux'

export default () => {
  const msg = useSelector((state) => state.msg)
  return (
    <div className="App">
      <Tips />
      <div>{msg}</div>
    </div>
  );
}