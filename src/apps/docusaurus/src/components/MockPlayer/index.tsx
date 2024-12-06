//@ts-nocheck
import React from "react";
import styles from "./index.module.scss";
import playCircle from '@site/static/img/playCircle.png'

const MockPlayer = (props) => {
  const onClick = (src) => {
    window.open(src);
  };
  return (
    <div className={styles.MockPlayer}>
      <div className={styles.removeMargin}>
        {props.videos.map((item, index) => (
          <div
            className={styles.player}
            key={index}
            onClick={() => {
              onClick(item.src);
            }}
          >
            <div className={styles.video}>
              <img src={playCircle} />
            </div>
            <div className={styles.txt}>
              <div className={styles.title}>
                <span className={styles.tipIcon}>📺</span>
                <span dangerouslySetInnerHTML={{ __html: item.title }} />
              </div>
              <div className={styles.desc}>
                <span className={styles.tipIcon}>📢</span>
                <span dangerouslySetInnerHTML={{ __html: item.desc }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MockPlayer;
