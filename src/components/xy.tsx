import React, {
  useState,
  useRef,
  useLayoutEffect,
  useEffect,
  useCallback,
} from "react";
import "./xy.css";

export interface XYProps {
  setParamValues: (x: number, y: number) => void;
  initX: number; // scale between 0 - 128
  initY: number; // scale between 0 - 128
}

const XY: React.SFC<XYProps> = ({ setParamValues, initX, initY }) => {
  const box = useRef<HTMLDivElement | null>(null);
  const ball = useRef<HTMLDivElement | null>(null);
  const [boundary, setBoundary] = useState<DOMRect>();
  const [ballSize, setBallSize] = useState<DOMRect>();
  const p1 = useRef(0);
  const p2 = useRef(0);
  const p3 = useRef(0);
  const p4 = useRef(0);
  const mouseDown = useRef(false);
  useEffect(() => {
    if (ball.current && boundary) {
      let top =
        (initX / boundary.width) * (boundary.width - ball.current.clientHeight);
      let left =
        (initY / boundary.width) * (boundary.width - ball.current.clientWidth);
      ball.current.style.top = `${top}px`;
      ball.current.style.left = `${left}px`;
    }
    let ballRef = ball.current;
    return () => {
      if (ballRef) {
        ballRef.style.top = `0`;
        ballRef.style.left = `0`;
      }
    };
  }, [boundary]); // eslint-disable-line
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
          let x = top / (boundary.height - ballSize.height);
          let y = left / (boundary.width - ballSize.width);
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

// const box = document.getElementById("box");
//       const ball = document.getElementById("ball");
//       const boundary = box.getBoundingClientRect();
//       const ballSize = ball.getBoundingClientRect();
//       console.log(boundary);
//       dragElement(ball);

//       function dragElement(el) {
//         let pos1 = 0,
//           pos2 = 0,
//           pos3 = 0,
//           pos4 = 0;
//         el.onmousedown = dragMouseDown;

//         function dragMouseDown(e) {
//           e = e || window.event;
//           e.preventDefault();
//           el.classList.add("highlight");
//           // get the mouse cursor position at startup:
//           pos3 = e.clientX;
//           pos4 = e.clientY;
//           document.onmouseup = closeDragElement;
//           // call a function whenever the cursor moves:
//           document.onmousemove = elementDrag;
//         }

//         function elementDrag(e) {
//           e = e || window.event;
//           e.preventDefault();
//           // calculate the new cursor position:
//           pos1 = pos3 - e.clientX;
//           pos2 = pos4 - e.clientY;
//           pos3 = e.clientX;
//           pos4 = e.clientY;
//           // calculate top and left of ball
//           let top = el.offsetTop - pos2;
//           let left = el.offsetLeft - pos1;
//           // constrain to box
//           if (top < 0) top = 0;
//           if (left < 0) left = 0;
//           if (top > boundary.height - ballSize.height)
//             top = boundary.height - ballSize.height;
//           if (left > boundary.width - ballSize.width)
//             left = boundary.width - ballSize.width;
//           // set the element's new position:
//           el.style.top = top + "px";
//           el.style.left = left + "px";
//         }

//         function closeDragElement() {
//           el.classList.remove("highlight");
//           // stop moving when mouse button is released
//           document.onmouseup = null;
//           document.onmousemove = null;
//         }
//       }
