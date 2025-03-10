import {
  DragHandleDots2Icon,
  HamburgerMenuIcon,
  MinusIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import { Box, Button, Card, Flex, Grid, Heading, Text } from "@radix-ui/themes";
import randomColor from "randomcolor";
import { useState } from "react";

interface IPlayer {
  id: number;
  name: string;
  health: number;
  color: string;
}

const createPlayer = (id: number): IPlayer => ({
  id,
  name: `Player ${id}`,
  health: Math.round(Math.random() * 60),
  color: randomColor({
    format: "rgba",
    alpha: 0.4,
  }),
});

type HealthHandler = (args: {
  id: number;
  options: { operation: "add" | "subtract"; step: number };
}) => void;

export const Table2Page = () => {
  const [players, setPlayers] = useState<IPlayer[]>(
    new Array(4).fill(0).map((_, i) => createPlayer(i + 1))
  );

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
    <Box
      // style={{
      //   backgroundImage: `url("https://www.wallpaperhub.app/_next/image?url=https%3A%2F%2Fcdn.wallpaperhub.app%2Fcloudcache%2Fb%2Fd%2F7%2F6%2F4%2Fb%2Fbd764bb25d49a05105060185774ba14cd2c846f7.jpg&w=4500&q=100")`,
      // }}
      height={"100vh"}
      p={"5px"}
    >
      <Grid
        height={"100%"}
        columns={(players.length / 2).toString()}
        rows={"1fr 1fr"}
        gap="10px"
      >
        {players.map((player, index) => {
          const side = index < 2 ? 1 : 2;
          return (
            <PlayerSquare
              key={player.id}
              player={player}
              side={side}
              updateHealth={updateHealth}
            />
          );
        })}
      </Grid>
      {/* <Flex height={"100%"}>
        {players.map((player, index) => {
          const side = index < 2 ? 1 : 2;
          return (
            <PlayerSquare
              key={player.id}
              player={player}
              side={side}
              updateHealth={updateHealth}
            />
          );
        })}
      </Flex> */}
      <Button
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          padding: "1%",
        }}
        variant="solid"
      >
        <HamburgerMenuIcon height={"calc(10px + 1vmin)"} width={"100%"} />
      </Button>
    </Box>
  );
};

export const PlayerSquare = ({
  player,
  side,
  updateHealth,
}: {
  player: IPlayer;
  side: number;
  updateHealth: HealthHandler;
}) => {
  return (
    <Card
      style={{
        padding: "0px",
        width: "100%",
      }}
    >
      <Flex
        position={"relative"}
        direction={"column"}
        align={"center"}
        justify={"center"}
        height={"100%"}
        style={{
          borderRadius: "10px",
          transform: `rotate(${side === 2 ? 0 : 180}deg)`,
          // backgroundColor: player.color,
        }}
      >
        <Heading
          style={{
            // color: Color(player.color).isDark() ? "white" : "black",
            fontSize: `calc(10px + 10vmin)`,
            pointerEvents: "none",
            WebkitUserSelect: "none",
            msUserSelect: "none",
            userSelect: "none",
            zIndex: 2,
            marginBottom: "calc(10px + 5vmin)",
          }}
        >
          {player.id}
        </Heading>
        <Grid
          position={"absolute"}
          width={"100%"}
          height={"100%"}
          columns={"1fr"}
          rows={"90% 9%"}
          areas={`
            "buttons"
            "menu"
          `}
        >
          <Grid
            style={{
              gridArea: "buttons",
            }}
            columns={"1fr 1fr"}
            rows={"1fr"}
            areas={`
              "minus plus"
            `}
          >
            <HealthButton
              count={-10}
              Icon={MinusIcon}
              handleClick={() =>
                updateHealth({
                  id: player.id,
                  options: { step: 10, operation: "subtract" },
                })
              }
            />
            <HealthButton
              count={player.health}
              Icon={PlusIcon}
              handleClick={() =>
                updateHealth({
                  id: player.id,
                  options: { step: 10, operation: "add" },
                })
              }
            />
          </Grid>
          <Button
            style={{
              gridArea: "menu",
              height: "100%",
            }}
            variant="outline"
            onClick={() => console.log(`${player.name} menu clicked`)}
          >
            <DragHandleDots2Icon
              style={{
                transform: `rotate(90deg)`,
              }}
              height={"calc(10px + 2vmin)"}
              width={"100%"}
            />
          </Button>
        </Grid>
      </Flex>
    </Card>
  );
};

const HealthButton: React.FC<{
  count: number;
  Icon: React.ElementType;
  handleClick: () => void;
}> = ({ count, Icon, handleClick }) => {
  return (
    <Button
      onClick={handleClick}
      // color="gray"
      style={{
        height: "100%",
        zIndex: 1,
        borderRadius: "0px",
        padding: "0px",
      }}
      variant="ghost"
    >
      <Flex justify={"center"} align={"center"}>
        <Icon
          style={{
            height: "calc(10px + 2vmin)",
            width: "calc(10px + 3vmin)",
          }}
        />
        <Text
          style={{
            fontSize: "calc(10px + 4vmin)",
          }}
        >
          {Math.abs(count)}
        </Text>
      </Flex>
    </Button>
  );
};
