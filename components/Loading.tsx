import classnames from "classnames";
import styles from "./Loading.module.css";

const Loading: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...rest
}) => {
  return (
    <div {...rest} className={classnames(styles["lds-grid"], className)}>
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
