import { useDispatch } from 'react-redux'
import { setMsg } from '../store/action-creator'

export default () => {
    const dispatch = useDispatch();
    const btnClick = () => {
        dispatch(setMsg('李四'));
    }
    return (
        <button className="Tips" onClick={btnClick}>
            子组件按钮
        </button>
    );
}
