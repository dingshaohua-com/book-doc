import Tips from './compnents/Tips'
import { connect } from "react-redux";

const App = (props) => {
  return (
    <div className="App">
      <Tips />
      <div>{props.msg}</div>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    msg: state.msg
  }
}
export default connect(mapStateToProps)(App);