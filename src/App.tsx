import React, { useEffect, useState } from "react";
import "./App.css";
import styled from "styled-components";

function App() {
  const initTail = [{ i: 1, j: 5 }];
  const initHead = { i: 2, j: 5 };
  const initIntervalTime = 250;
  const initDirection = "s";
  const table = Array.from(Array(21), () => new Array(21).fill(null));
  const [tail, setTail] = useState<Array<{ i: number; j: number }>>(initTail);
  const [head, setHead] = useState<{ i: number; j: number }>(initHead);
  const [apple, setApple] = useState<{ i: number; j: number } | null>(null);
  const [direction, setDirection] = useState<"a" | "s" | "d" | "a">(
    initDirection
  );
  const [intervalTime, setIntervalTime] = useState(initIntervalTime);

  const refresh = () => {
    setTail(initTail);
    setHead(initHead);
    setApple(null);
    setIntervalTime(initIntervalTime);
    setDirection(initDirection);
  };

  const handleGenerateApple = () => {
    if (apple) return;

    const appleCoordinates = {
      i: Math.floor(Math.random() * 20) + 1,
      j: Math.floor(Math.random() * 20) + 1
    };

    const canGenerate = tail.every((t) => {
      const IsTail = t.i === appleCoordinates.i && t.j === appleCoordinates.j;
      const IsHead =
        head.i === appleCoordinates.i && head.j === appleCoordinates.j;
      return !IsTail && !IsHead;
    });

    if (!canGenerate) {
      handleGenerateApple();
    } else {
      (tail.length - 1) % 2 === 0 &&
        setIntervalTime(intervalTime - 20 > 1 ? intervalTime - 10 : 20);

      setApple(appleCoordinates);
    }
  };

  const changePosition = {
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
  const handleMove = () => {
    handleUpdateSnakeLength();
    changePosition[direction]();

    if (tail.some((f) => f.i === head.i && f.j === head.j)) {
      alert("You died, your score : " + (tail.length - 1));
      refresh();
    }
  };

  const handleUpdateSnakeLength = () => {
    const ateApple = head.i === apple?.i && head.j === apple?.j;
    const pos = ateApple ? 0 : 1;
    if (ateApple) {
      setApple(null);
    }
    setTail([...tail.slice(pos), head]);
  };

  useEffect(() => {
    let intervalId: any;
    if (table) {
      intervalId = setInterval(() => {
        handleMove();
        handleGenerateApple();
      }, intervalTime);
    }

    return () => clearInterval(intervalId);
  }, [table, head]);

  const pairs = [
    ["w", "s"],
    ["d", "a"]
  ];

  const Elements = {
    head: <Head head={true} direction={direction} src="/head.png"></Head>,
    tail: <Head direction={direction} src="/tail.png"></Head>,
    apple: <Head direction={direction} src="/apple.png"></Head>
  };

  const handleChangeDirection = (key: string) => {
    handleUpdateSnakeLength();
    changePosition[key as "a" | "s" | "d" | "a"]();
    setDirection(key as "a" | "s" | "d" | "a");
  };

  return (
    <Page
      tabIndex={0}
      onKeyDown={(e) =>
        Object.keys(changePosition).some((a) => a === e.key) &&
        !pairs.some(
          (p) => p.some((p) => p === e.key) && p.some((p) => p === direction)
        ) &&
        handleChangeDirection(e?.key)
      }
    >
      <Title>GLIX_SNAKE</Title>
      <Score>Score: {tail.length - 1}</Score>
      <Container>
        {table.map((t: any, index: any) => {
          return (
            <Row>
              {table[index].map((tt: any, ind: any) => {
                const element =
                  (head.i === index && head.j === ind && "head") ||
                  (apple?.i === index && apple?.j === ind && "apple") ||
                  (tail.some((tail) => tail.i === index && tail.j === ind) &&
                    "tail");

                return (
                  <Square>
                    {Elements[element as "head" | "apple" | "tail"] || null}
                  </Square>
                );
              })}
            </Row>
          );
        })}
      </Container>
    </Page>
  );
}

export default App;

const Row = styled.div`
  display: flex;
`;

const Square = styled.div`
  height: 38px;
  width: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Head = styled.img<{ direction: string; head?: boolean }>`
  height: 30px;
  width: 30px;
  ${({ direction, head }) =>
    head
      ? direction === "a"
        ? `
 -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  `
        : direction === "s"
        ? `transform: rotate(90deg);`
        : direction === "w"
        ? `transform: rotate(-90deg);`
        : null
      : null}
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: fit-content;
  border: 1px solid black;
`;

const Page = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-width: 100vw;

  &:focus {
    outline: none;
  }
`;

const Title = styled.div`
  font-size: 4rem;
  text-align: center;
`;

const Score = styled.div`
  font-size: 2rem;
  text-align: center;
`;
