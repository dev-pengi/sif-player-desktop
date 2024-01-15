import { FC } from "react";
import "./styles/loaders.css";

const ActivityIndicator: FC = () => {
  return (
    <div className="activity-indicator">
      <div className="spinner">
        <div className="circle circle-1">
          <div className="circle-inner"></div>
        </div>
        <div className="circle circle-2">
          <div className="circle-inner"></div>
        </div>
      </div>
    </div>
  );
};

export default ActivityIndicator;
