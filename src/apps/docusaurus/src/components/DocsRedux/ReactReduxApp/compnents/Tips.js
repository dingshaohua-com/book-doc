import { connect } from "react-redux";
import { setMsg } from '../store/action-creator'

const Tips = (props) => {
    const btnClick = () => {
        props.dispatch(setMsg('李四'));
    }
    return (
        <button className="Tips" onClick={btnClick}>
            子组件按钮
        </button>
    );
}

export default connect()(Tips);