//@ts-nocheck
import React from "react";
import styles from "./index.module.scss";
import book from '@site/static/img/book.png'

const MockBook = (props) => {
  const onClick = (src) => {
    window.open(src);
  };
  return (
    <div className={styles.MockBook}>
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
              <img src={book} />
            </div>
            <div className={styles.txt}>
              <div className={styles.title}>
                <span className={styles.tipIcon}>📗</span>
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

export default MockBook;
