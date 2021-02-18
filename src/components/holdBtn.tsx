import React from "react";

export interface HoldBtnProps {
  hold: boolean;
  handleHoldToggle: () => void;
  holdNotes: React.MutableRefObject<number[]>;
}

const HoldBtn: React.SFC<HoldBtnProps> = ({
  hold,
  handleHoldToggle,
  holdNotes,
}) => {
  return (
    <div className="hold">
      <div
        className={`hold-btn ${hold ? "enabled" : ""}`}
        onClick={handleHoldToggle}
      >
        ARPEGGIATOR (
        {holdNotes.current.length
          ? " " + holdNotes.current.length + " "
          : " empty "}
        )
      </div>
    </div>
  );
};

export default HoldBtn;
