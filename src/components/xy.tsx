import React, {
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
  useCallback,
  useContext,
} from "react";
import { SocketContext } from "../app";

import "./xy.css";

export interface XYProps {
  setParamValues: (x: number, y: number) => void;
  initX: number; // scale between 0 - 128
  initY: number; // scale between 0 - 128
  name: string; // name should start with Capital letter for socket to work
  preset: string;
}

interface XYParams {
  x: number;
  y: number;
}

const XY: React.SFC<XYProps> = ({
  setParamValues,
  initX,
  initY,
  name,
  preset,
}) => {
  const socket = useContext(SocketContext);
  const box = useRef<HTMLDivElement | null>(null);
  const ball = useRef<HTMLDivElement | null>(null);
  const [boundary, setBoundary] = useState<DOMRect>();
  const [ballSize, setBallSize] = useState<DOMRect>();
  const p1 = useRef(0);
  const p2 = useRef(0);
  const p3 = useRef(0);
  const p4 = useRef(0);
  const mouseDown = useRef(false);
  const setBallPosition = useCallback(() => {
    if (ball.current && boundary) {
      let top =
        (initY / boundary.width) * (boundary.width - ball.current.clientHeight);
      let left =
        (initX / boundary.width) * (boundary.width - ball.current.clientWidth);
      ball.current.style.top = `${top}px`;
      ball.current.style.left = `${left}px`;
    }
  }, [boundary, initX, initY]);
  useEffect(() => {
    setBallPosition();
    let ballRef = ball.current;
    return () => {
      if (ballRef) {
        ballRef.style.top = `0`;
        ballRef.style.left = `0`;
      }
    };
  }, [boundary, preset]); // eslint-disable-line

  useEffect(() => {
    socket.on(`send${name}`, (params: XYParams) => {
      if (ball.current && boundary && ballSize) {
        let left = params.x * (boundary.width - ballSize.width);
        let top = params.y * (boundary.height - ballSize.height);
        ball.current.style.top = top + "px";
        ball.current.style.left = left + "px";
      }
    });
    return () => {
      socket.off(`set${name}`);
    };
  });
  useLayoutEffect(() => {
    setBoundary(box.current?.getBoundingClientRect());
    setBallSize(ball.current?.getBoundingClientRect());
  }, []);
  const handleTouchDown = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    p3.current = e.changedTouches[0].clientX;
    p4.current = e.changedTouches[0].clientY;
  }, []);
  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      // calculate the new cursor position:
      p1.current = p3.current - e.changedTouches[0].clientX;
      p2.current = p4.current - e.changedTouches[0].clientY;
      p3.current = e.changedTouches[0].clientX;
      p4.current = e.changedTouches[0].clientY;
      if (ball.current) {
        // calculate top and left of ball
        let top = ball.current?.offsetTop - p2.current;
        let left = ball.current?.offsetLeft - p1.current;
        // constrain to box
        if (top < 0) top = 0;
        if (left < 0) left = 0;
        if (boundary && ballSize) {
          if (top > boundary.height - ballSize.height) {
            top = boundary.height - ballSize.height;
          }
          if (left > boundary.width - ballSize.width) {
            left = boundary.width - ballSize.width;
          }
          let x = left / (boundary.width - ballSize.width);
          let y = top / (boundary.height - ballSize.height);
          setParamValues(x, y);
        }
        // set the element's new position:
        ball.current.style.top = top + "px";
        ball.current.style.left = left + "px";
      }
    },
    [ballSize, boundary, setParamValues]
  );

  const handleMouseMove = useCallback(
    (e: any) => {
      if (mouseDown.current) {
        // calculate the new cursor position:
        p1.current = p3.current - e.clientX;
        p2.current = p4.current - e.clientY;
        p3.current = e.clientX;
        p4.current = e.clientY;
        if (ball.current) {
          // calculate top and left of ball
          let top = ball.current?.offsetTop - p2.current;
          let left = ball.current?.offsetLeft - p1.current;
          // constrain to box
          if (top < 0) top = 0;
          if (left < 0) left = 0;
          if (boundary && ballSize) {
            if (top > boundary.height - ballSize.height) {
              top = boundary.height - ballSize.height;
            }
            if (left > boundary.width - ballSize.width) {
              left = boundary.width - ballSize.width;
            }
            let x = left / (boundary.width - ballSize.width);
            let y = top / (boundary.height - ballSize.height);
            setParamValues(x, y);
          }
          // set the element's new position:
          ball.current.style.top = top + "px";
          ball.current.style.left = left + "px";
        }
      }
    },
    [ballSize, boundary, setParamValues]
  );
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      mouseDown.current = true;
      p3.current = e.clientX;
      p4.current = e.clientY;
      window.onmousemove = handleMouseMove;
      window.onmouseup = function () {
        window.onmousemove = null;
        mouseDown.current = false;
      };
    },
    [handleMouseMove]
  );
  const handleMouseUp = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    mouseDown.current = false;
  }, []);

  return (
    <div className="xy" ref={box} onMouseMove={handleMouseMove}>
      <div
        className="xy-ball"
        ref={ball}
        onTouchStart={handleTouchDown}
        onTouchMove={handleTouchMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
};

export default XY;
