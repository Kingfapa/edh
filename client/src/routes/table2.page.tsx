import {
  DragHandleDots2Icon,
  HamburgerMenuIcon,
  MinusIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import {
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Heading,
  Text,
} from "@radix-ui/themes";
import randomColor from "randomcolor";
import { useRef, useState } from "react";
import "./table2.page.css";
import { useLongPress } from "@uidotdev/usehooks";
import { useDebounce } from "use-debounce";

interface IPlayer {
  id: number;
  name: string;
  health: number;
  color: string;
  previousHealth?: number;
}

const createPlayer = (id: number): IPlayer => ({
  id,
  name: `Player ${id}`,
  health: Math.round(Math.random() * 60),
  color: randomColor({
    format: "rgba",
    alpha: 0.4,
  }),
  previousHealth: 0,
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
    <Container
      // style={{
      //   backgroundImage: `url("https://www.wallpaperhub.app/_next/image?url=https%3A%2F%2Fcdn.wallpaperhub.app%2Fcloudcache%2Fb%2Fd%2F7%2F6%2F4%2Fb%2Fbd764bb25d49a05105060185774ba14cd2c846f7.jpg&w=4500&q=100")`,
      // }}
      maxWidth={"1400px"}
      height={"100vh"}
    >
      <Grid
        height={"100%"}
        columns={(players.length / 2).toString()}
        rows={"1fr 1fr"}
        gap="10px"
        p={"1%"}
      >
        {players.map((player, index) => {
          return (
            <PlayerSquare
              key={player.id}
              player={player}
              index={index}
              updateHealth={updateHealth}
              players={players}
            />
          );
        })}
      </Grid>
      {/* <Flex height={"100%"} wrap={"wrap"}>
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
        }}
        variant="solid"
      >
        <HamburgerMenuIcon height={"calc(10px + 1vmin)"} width={"100%"} />
      </Button>
    </Container>
  );
};

export const PlayerSquare = ({
  player,
  index,
  updateHealth,
  players,
}: {
  player: IPlayer;
  players: IPlayer[];
  index: number;
  updateHealth: HealthHandler;
}) => {
  const [debouncedHealth] = useDebounce(player.health, 2000);
  // Calculate the rotation of the player square
  const rotation = (() => {
    if (players.length === 2) {
      return (index + 1) * 180;
    }
    if (players.length === 4) {
      return (index < 2 ? 1 : 0) * 180;
    }
  })();
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
        width={"100%"}
        style={{
          borderRadius: "10px",
          transform: `rotate(${rotation}deg)`,
          // backgroundColor: player.color,
        }}
      >
        <Flex
          position={"absolute"}
          style={{
            fontSize: `calc(10px + 10vmin)`,
            height: "100%",
            transform: "translateX(-50%)",
            marginBottom: "10%",
            zIndex: 2,
          }}
          justify={"center"}
          align={"center"}
          left={"20%"}
          className="prevent-select"
        >
          <MinusIcon
            style={{
              height: "calc(10px + 2vmin)",
              width: "calc(10px + 3vmin)",
            }}
          />
          <Text
            style={{
              fontSize: "calc(10px + 3vmin)",
            }}
          >
            {player.health !== debouncedHealth &&
            player.health < debouncedHealth ? (
              <Text
                style={{
                  fontSize: "calc(10px + 3vmin)",
                }}
              >
                {Math.abs(player.health - debouncedHealth)}
              </Text>
            ) : null}
          </Text>
        </Flex>
        <Flex
          position={"absolute"}
          style={{
            fontSize: `calc(10px + 10vmin)`,
            height: "100%",
            transform: "translateX(-50%)",
            marginBottom: "10%",
            zIndex: 2,
          }}
          justify={"center"}
          align={"center"}
          left={"50%"}
          className="prevent-select"
        >
          <Heading
            style={{
              fontSize: "inherit",
            }}
          >
            {player.health}
          </Heading>
        </Flex>
        <Flex
          position={"absolute"}
          style={{
            fontSize: `calc(10px + 10vmin)`,
            height: "100%",
            transform: "translateX(-50%)",
            marginBottom: "10%",
            zIndex: 2,
          }}
          justify={"center"}
          align={"center"}
          left={"80%"}
          className="prevent-select"
        >
          <PlusIcon
            style={{
              height: "calc(10px + 2vmin)",
              width: "calc(10px + 3vmin)",
            }}
          />

          <Text
            style={{
              fontSize: "calc(10px + 3vmin)",
            }}
          >
            {player.health !== debouncedHealth &&
            player.health > debouncedHealth ? (
              <Text
                style={{
                  fontSize: "calc(10px + 3vmin)",
                }}
              >
                {player.health - debouncedHealth}
              </Text>
            ) : null}
          </Text>
        </Flex>

        <Grid
          position={"absolute"}
          width={"100%"}
          height={"100%"}
          columns={"1fr"}
          rows={"90% 10%"}
          p={"5px"}
          areas={`
            "buttons"
            "menu"
          `}
        >
          <Flex
            width={"100%"}
            justify={"between"}
            style={{
              gridArea: "buttons",
            }}
          >
            <HealthButton
              count={-10}
              Icon={MinusIcon}
              handleClick={() =>
                updateHealth({
                  id: player.id,
                  options: { step: 1, operation: "subtract" },
                })
              }
              handleLongPress={() =>
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
                  options: { step: 1, operation: "add" },
                })
              }
              handleLongPress={() =>
                updateHealth({
                  id: player.id,
                  options: { step: 10, operation: "add" },
                })
              }
            />
          </Flex>
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
  handleLongPress: () => void;
}> = ({ handleClick, handleLongPress }) => {
  const interval = useRef<number | null>(null);
  const attrs = useLongPress(
    () => {
      interval.current = window.setInterval(handleLongPress, 500);
    },
    {
      onCancel: () => handleClick(),
      onFinish: () => {
        if (interval.current) {
          clearInterval(interval.current);
        }
      },
      threshold: 500,
    }
  );

  return (
    <Button
      className="rt-ghost-no-padding"
      {...attrs}
      // color="gray"
      size={"1"}
      style={{
        height: "100%",
        flex: 1,
        zIndex: 1,
        borderRadius: "0px",
        padding: "0px",
      }}
      variant="ghost"
    />
  );
};
