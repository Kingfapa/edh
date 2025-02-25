import { Button, Flex, List, Stack, Textarea, Text } from "@mantine/core";
import { StatusIcon } from "./StatusIcon";
import { User } from "./User";
import { useForm } from "@mantine/form";

export const MessagePanel: React.FC<{
  user: User;
  onMessage: (content: string) => void;
}> = ({ user, onMessage }) => {
  const form = useForm({
    mode: "controlled",
    initialValues: {
      message: "",
    },
  });

  return (
    <Stack>
      <Flex
        style={{
          borderBottom: "1px solid #e9e9e9",
        }}
        align="center"
        justify="flex-start"
        gap="sm"
        py="md"
        px="lg"
      >
        <StatusIcon connected={user.connected} />
        {user.username}
      </Flex>
      <Stack px="md">
        <List listStyleType="none" px="sm">
          <Stack>
            {user.messages.map((message, index) => {
              return (
                <List.Item key={index}>
                  <Text fw="bold">
                    {message.fromSelf ? "(yourself)" : user.username}
                  </Text>
                  <Text>{message.content}</Text>
                </List.Item>
              );
            })}
          </Stack>
        </List>
        <form
          style={{
            flex: 1,
          }}
          onSubmit={form.onSubmit((values) => {
            onMessage(values.message);
            form.reset();
          })}
        >
          <Flex gap={"sm"} align={"center"}>
            <Textarea
              flex={1}
              placeholder="Your message..."
              key={form.key("message")}
              {...form.getInputProps("message")}
            />
            <Button type="submit">Send</Button>
          </Flex>
        </form>
      </Stack>
    </Stack>
  );
};
