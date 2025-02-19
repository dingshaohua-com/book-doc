//@ts-nocheck
import React, { useEffect, useRef, useState } from "react";
import styles from "./index.module.scss";

const Before = (props) => {
  return (
    <div className={styles.Before}>
      <div>
        <div>个人稳定，不频繁跳槽。</div>
        <div>
          能力较强，必要时可承担后端和运维基础工作，为公司节省开支
        </div>
      </div>
    </div>
  );
};
export default Before;
