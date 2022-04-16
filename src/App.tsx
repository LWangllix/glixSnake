import React, { useEffect, useState } from "react";
import "./App.css";
import styled from "styled-components";

function App() {
  const initTail = [{ i: 1, j: 5 }];
  const initHead = { i: 2, j: 5 };

  const table = Array.from(Array(41), () => new Array(41).fill(null));
  const [tail, setTail] = useState<Array<{ i: number; j: number }>>(initTail);
  const [head, setHead] = useState<{ i: number; j: number }>(initHead);
  const [apple, setApple] = useState<{ i: number; j: number } | null>(null);
  const [direction, setDirection] = useState<"a" | "s" | "d" | "a">("s");

  const refresh = () => {
    setTail(initTail);
    setHead(initHead);
    setApple(null);
  };

  const generateApple = () => {
    if (apple) return;

    const appleCordinates = {
      i: Math.floor(Math.random() * 40) + 1,
      j: Math.floor(Math.random() * 40) + 1
    };

    const canGenerate = tail.some((t) => {
      const IsTail = t.i === appleCordinates.i && t.j === appleCordinates.j;
      const IsHead =
        head.i === appleCordinates.i && head.j === appleCordinates.j;
      return !IsTail && !IsHead;
    });

    if (!canGenerate) {
      generateApple();
    }
    setApple(appleCordinates);
  };

  const changePos = {
    s: () => {
      setHead({ i: head.i === table.length - 1 ? 0 : head.i + 1, j: head.j });
    },
    w: () => {
      setHead({ i: head.i === 0 ? table.length - 1 : head.i - 1, j: head.j });
    },
    d: () => {
      setHead({
        i: head.i,
        j: head.j === table[0].length - 1 ? 0 : head.j + 1
      });
    },
    a: () => {
      setHead({
        i: head.i,
        j: head.j === 0 ? table[0].length - 1 : head.j - 1
      });
    }
  };

  const move = () => {
    const ateApple = head.i === apple?.i && head.j === apple?.j;
    const pos = ateApple ? 0 : 1;
    if (ateApple) {
      setApple(null);
    }
    setTail([...tail.slice(pos), head]);

    changePos[direction]();

    if (tail.some((f) => f.i === head.i && f.j === head.j)) {
      alert("TU MIREJ");
      refresh();
    }
  };

  useEffect(() => {
    let intervalId: any;
    if (table) {
      intervalId = setInterval(() => {
        move();
        generateApple();
      }, 100);
    }

    return () => clearInterval(intervalId);
  }, [table, head]);

  const pairs = [
    ["w", "s"],
    ["d", "a"]
  ];

  return (
    <Container
      tabIndex={0}
      onKeyDown={(e) =>
        Object.keys(changePos).some((a) => a === e.key) &&
        !pairs.some(
          (p) => p.some((p) => p === e.key) && p.some((p) => p === direction)
        ) &&
        setDirection(e?.key as "a" | "s" | "d" | "a")
      }
    >
      {table.map((t: any, index: any) => {
        return (
          <Row>
            {table[index].map((tt: any, ind: any) => {
              const isHead = head.i === index && head.j === ind;
              const isApple = apple?.i === index && apple?.j === ind;
              const isTail = tail.some(
                (tail) => tail.i === index && tail.j === ind
              );
              return (
                <Square>
                  {isHead || isTail || isApple ? <Head></Head> : null}
                </Square>
              );
            })}
          </Row>
        );
      })}
    </Container>
  );
}

export default App;

const Row = styled.div`
  display: flex;
`;

const Square = styled.div`
  height: 20px;
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Head = styled.div`
  height: 16px;
  width: 16px;
  background-color: black;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: fit-content;
  border: 1px solid black;
`;
