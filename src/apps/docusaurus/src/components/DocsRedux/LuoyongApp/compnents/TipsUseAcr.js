import store from '../store'
import { setMsg } from '../store/action-creator'

export default () => {
    const btnClick = () => {
        store.dispatch(setMsg('李四'));
    }
    return (
        <button className="Tips" onClick={btnClick}>
            子组件按钮
        </button>
    );
}
