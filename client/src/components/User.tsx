import { Box, Flex, ThemeIcon } from "@mantine/core";
import { StatusIcon } from "./StatusIcon";
import { IconBrandMantine, IconExclamationMark } from "@tabler/icons-react";

export interface User {
  userID: string;
  username: string;
  connected: boolean;
  self: boolean;
  hasNewMessages: boolean;
  messages: { content: string; from?: string; fromSelf?: boolean }[];
}

export const User: React.FC<{
  user: User;
  selected: boolean;
  onSelect: (user: User) => void;
}> = ({ user, selected, onSelect }) => {
  return (
    <Flex
      className="user"
      p="sm"
      style={{
        backgroundColor: selected ? "#1164a3" : "initial",
        cursor: "pointer",
        display: "flex",
      }}
      align={"center"}
      justify={"space-between"}
      onClick={() => onSelect(user)}
    >
      <Box className="description" display="inline-block">
        <Flex className="name">
          {user.username} {user.self ? " (yourself)" : ""}
        </Flex>
        <Flex
          className="status"
          align={"center"}
          justify={"flex-start"}
          gap={"xs"}
          c="gray"
        >
          <StatusIcon connected={user.connected} />
          {user.connected ? "Online" : "Offline"}
        </Flex>
      </Box>
      {user.hasNewMessages ? (
        <Flex align={"center"} justify={"center"} className="new-messages">
          <ThemeIcon color="red" size={"sm"}>
            <IconExclamationMark />
          </ThemeIcon>
        </Flex>
      ) : null}
    </Flex>
  );
};
