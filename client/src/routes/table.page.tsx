import { Flex, Text } from "@mantine/core";
import { useState } from "react";
import "./table.page.css";
import { clsx } from "clsx";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";

interface IPlayer {
  id: number;
  name: string;
  health: number;
  color: string;
}

const randomColor = () =>
  "#" + Math.floor(Math.random() * 16777215).toString(16);

export const TablePage = () => {
  const [sm, md] = [
    useMediaQuery("(max-width: 600px)"),
    useMediaQuery("(max-width: 900px)"),
    useMediaQuery("(max-width: 1200px)"),
  ];
  const [players, setPlayers] = useState<IPlayer[] | undefined>([
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

  console.log(players);

  const updateHealth = (id: number, method: "add" | "decrease") => {
    console.log("update health", id, method);
    if (!players) {
      return;
    }
    setPlayers(
      players.map((player) => {
        if (player.id === id) {
          return {
            ...player,
            health: player.health + (method === "add" ? 1 : -1),
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
        {players &&
          players.map((player, index) => {
            const side = index < 2 ? 1 : 2;
            return (
              <div key={player.id}>
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
                  }}
                >
                  <Flex
                    pos="absolute"
                    align="stretch"
                    justify="stretch"
                    w="100%"
                    h="100%"
                    style={{
                      zIndex: 1,
                    }}
                  >
                    <button
                      className="healthButton"
                      onClick={() => updateHealth(player.id, "add")}
                    >
                      <IconPlus stroke={2} size={"15%"} />
                    </button>
                    <button
                      className="healthButton"
                      onClick={() => updateHealth(player.id, "decrease")}
                    >
                      <IconMinus stroke={2} size={"15%"} />
                    </button>
                  </Flex>

                  <Text
                    className="healthText prevent-select strokeme"
                    style={{
                      zIndex: 2,
                      fontWeight: "bold",
                      fontSize: `${sm ? "3rem" : md ? "5rem" : "10rem"}`,
                    }}
                  >
                    {player.health}
                  </Text>
                </Flex>
              </div>
            );
          })}
      </div>
    </div>
  );
};
