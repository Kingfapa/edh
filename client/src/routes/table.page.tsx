import { Flex, Stack, Text } from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import "./table.page.css";
import { clsx } from "clsx";
import { IconMenu, IconMinus, IconPlus } from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";
import Color from "color";
import { useDebounce } from "use-debounce";
import randomColor from "randomcolor";

interface IPlayer {
  id: number;
  name: string;
  health: number;
  color: string;
}

type HealthHandler = (params: IHealthOptions) => void;

interface IHealthOptions {
  id: number;
  options: {
    step: number;
    operation: "add" | "subtract";
  };
}

const PlayerSquare = ({
  player,
  side,
  healthHandler,
}: {
  player: IPlayer;
  side: number;
  healthHandler: HealthHandler;
}) => {
  const [sm, md] = [
    useMediaQuery("(max-width: 600px)"),
    useMediaQuery("(max-width: 900px)"),
    useMediaQuery("(max-width: 1200px)"),
  ];

  const CLICK_DURATION_MS = 500; // Time to differentiate between click and hold
  const HOLD_REPEAT_INTERVAL_MS = 600; // Interval for repeated increments during hold
  const SINGLE_CLICK_STEP = 1;
  const HOLD_CLICK_STEP = 10;

  const holdTimeout = useRef<number | null>(null);
  const holdInterval = useRef<number | null>(null);
  const isHolding = useRef<boolean>(false);
  const isLongClick = useRef<boolean>(false);

  useEffect(() => {
    return () => {
      if (holdTimeout.current) {
        clearTimeout(holdTimeout.current);
      }
      if (holdInterval.current) {
        clearInterval(holdInterval.current);
      }
    };
  }, []);

  const clearHold = () => {
    if (holdTimeout.current) {
      clearTimeout(holdTimeout.current);
      holdTimeout.current = null;
    }
    if (holdInterval.current) {
      clearInterval(holdInterval.current);
      holdInterval.current = null;
    }
    isHolding.current = false;
    isLongClick.current = false;
  };

  const handleMouseDown = (operation: "add" | "subtract") => {
    isHolding.current = false;
    isLongClick.current = false;

    // Start timeout to detect hold
    holdTimeout.current = window.setTimeout(() => {
      isHolding.current = true;
      isLongClick.current = true;
      holdInterval.current = window.setInterval(() => {
        healthHandler({
          id: player.id,
          options: { step: HOLD_CLICK_STEP, operation },
        });
      }, HOLD_REPEAT_INTERVAL_MS);
    }, CLICK_DURATION_MS);
  };

  const handleMouseUp = (operation: "add" | "subtract") => {
    if (!isLongClick.current) {
      // If released before hold timeout, it was a quick click
      healthHandler({
        id: player.id,
        options: { step: SINGLE_CLICK_STEP, operation },
      });
    }
    clearHold();
  };

  const handleTouchStart = (operation: "add" | "subtract") => {
    handleMouseDown(operation);
  };

  const handleTouchEnd = (operation: "add" | "subtract") => {
    handleMouseUp(operation);
  };

  return (
    <Flex
      pos={"relative"}
      style={{
        width: "100%",
        height: "100%",
        transform: `rotate(${side === 2 ? 0 : 180}deg)`,
        backgroundColor: player.color,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0px 0px 15px 15px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          display: "grid",
          gridTemplateColumns: "1fr",
          gridTemplateRows: "90% 10%",
          gap: "0px 0px",
          gridTemplateAreas: `
          "buttons"
          "menu"
        `,
        }}
      >
        <div
          style={{
            gridArea: "buttons",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr",
            gap: "0px 0px",
            gridTemplateAreas: `
            "minus plus"
          `,
          }}
        >
          <button
            className={clsx("healthButton")}
            onMouseDown={() => handleMouseDown("subtract")}
            onMouseUp={() => handleMouseUp("subtract")}
            onMouseLeave={clearHold}
            onTouchStart={() => handleTouchStart("subtract")}
            onTouchEnd={() => handleTouchEnd("subtract")}
            onTouchCancel={clearHold}
          >
            <IconMinus stroke={2} size={"15%"} />
          </button>
          <button
            className="healthButton"
            onMouseDown={() => handleMouseDown("add")}
            onMouseUp={() => handleMouseUp("add")}
            onMouseLeave={clearHold}
            onTouchStart={() => handleTouchStart("add")}
            onTouchEnd={() => handleTouchEnd("add")}
            onTouchCancel={clearHold}
          >
            <IconPlus stroke={2} size={"15%"} />
          </button>
        </div>
        <button
          style={{
            gridArea: "menu",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            outline: "none",
            border: "none",
            backgroundColor: "transparent",
            color: "white",
            cursor: "pointer",
            boxShadow: "0px 0px 15px 5px rgba(0,0,0,0.1)",
          }}
        >
          <IconMenu
            onClick={() => console.log(`${player.name} menu clicked`)}
            stroke={2}
            size={"100%"}
          />
        </button>
      </div>

      <Text
        className="healthText prevent-select"
        style={{
          zIndex: 2,
          fontSize: `${sm ? "3rem" : md ? "5rem" : "10rem"}`,
          color: Color(player.color).isDark() ? "white" : "black",
          marginBottom: "10%",
        }}
      >
        {player.health}
      </Text>
    </Flex>
  );
};

export const TablePage = () => {
  const [players, setPlayers] = useState<IPlayer[]>([
    {
      id: 1,
      name: "Player 1",
      health: 40,
      color: randomColor(),
    },
    {
      id: 2,
      name: "Player 2",
      health: 40,
      color: randomColor(),
    },
    {
      id: 3,
      name: "Player 3",
      health: 40,
      color: randomColor(),
    },
    {
      id: 4,
      name: "Player 4",
      health: 40,
      color: randomColor(),
    },
  ]);

  const updateHealth: HealthHandler = ({ id, options }) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) => {
        if (player.id === id) {
          return {
            ...player,
            health:
              player.health +
              (options.operation === "add" ? options.step : -options.step),
          };
        }
        return player;
      })
    );
  };

  return (
    <div
      style={{
        height: "100vh",
      }}
    >
      <div
        className={clsx(
          "container",
          players && `${`layout-${players.length}-players`}`
        )}
        style={{
          gap: "10px",
          padding: "10px",
        }}
      >
        {players.map((player, index) => (
          <PlayerSquare
            key={player.id}
            player={player}
            side={index < 2 ? 1 : 2}
            healthHandler={updateHealth}
          />
        ))}
      </div>
    </div>
  );
};
