import store from '../store'

export default () => {
    const btnClick = () => {
        store.dispatch({
            type: 'SET_MSG',
            payload: '李四'
        });
    }
    return (
        <button className="Tips" onClick={btnClick}>
            子组件按钮
        </button>
    );
}
