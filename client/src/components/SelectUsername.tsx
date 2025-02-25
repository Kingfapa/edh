import { Button, Container, Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

export const SelectUsername: React.FC<{
  onSubmit: (username: string) => void;
}> = ({ onSubmit }) => {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      username: "",
    },
    validate: {
      username: (value) => (value.length > 2 ? null : "Username is too short"),
    },
  });

  return (
    <Container ta={"center"} size="sm" mt="200px">
      <form onSubmit={form.onSubmit((values) => onSubmit(values.username))}>
        <TextInput
          label="Username"
          placeholder="Your username..."
          key={form.key("username")}
          {...form.getInputProps("username")}
        />

        <Group justify="flex-end" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Container>
  );
};
