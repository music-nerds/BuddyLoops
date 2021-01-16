import React from "react";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import "./userIndicators.css";

interface Props {
  numUsers: number;
}

const UserIndicators: React.FC<Props> = ({ numUsers }) => {
  return (
    <div className="user-indicators">
      {new Array(numUsers).fill(null).map((_, i) => (
        <div key={i}>
          <AccountCircleIcon
            style={{ color: "var(--blue)", fontSize: "1rem" }}
          />
        </div>
      ))}
    </div>
  );
};

export default UserIndicators;
