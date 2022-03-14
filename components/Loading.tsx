import classnames from "classnames";
import styles from "./Loading.module.css";

const Loading: React.FC<React.HTMLAttributes<HTMLDivElement>> = () => {
  return (
    <div className={classnames(styles["lds-grid"])}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default Loading;
