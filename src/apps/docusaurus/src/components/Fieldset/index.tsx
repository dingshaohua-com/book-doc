//@ts-nocheck
import React from "react";
import styles from "./index.module.scss";
import exampleImg from '@site/static/img/example.png'

const Fieldset = (props) => {
    return <div className={styles.Fieldset}>
        <div className={styles.title}>{props.title}</div>
        <div className={styles.content}>{props.children}</div>
        <img className={styles.exampleImg} src={exampleImg} alt="exampleImg" />
    </div>
}

export default Fieldset;
