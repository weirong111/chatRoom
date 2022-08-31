import { Spin } from "antd";
import { FC } from "react";
import React from "react";
import classnames from "classnames";
import "./index.scss";
const Loading: FC<{ isLoading: boolean; isPosition?: boolean }> = ({
  isLoading,
  isPosition = true,
}) => {
  return isLoading ? (
    <div className={classnames({ loading: true, Position: isPosition })}>
      <Spin tip="Loading"></Spin>
    </div>
  ) : (
    <div></div>
  );
};

export default React.memo(Loading);
