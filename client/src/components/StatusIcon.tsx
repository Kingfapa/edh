import { Box } from "@mantine/core";

export const StatusIcon = ({ connected }: { connected: boolean }) => {
  return (
    <Box
      style={{
        width: 10,
        height: 10,
        borderRadius: "50%",
        backgroundColor: connected ? "#16c784" : "#f85c7c",
      }}
    />
  );
};
