import { Login } from "@/components/Login";
import { Box, Container, Flex, Heading } from "@radix-ui/themes";

export const Home: React.FC = () => {
  return (
    <Container pt="10%">
      <Box
        py="8"
        style={{
          backgroundColor: "var(--gray-a2)",
          borderRadius: "var(--radius-3)",
        }}
      >
        <Flex align={"center"} justify={"center"} direction={"column"} gap="8">
          <Heading>Welcome to the EDH Rooms!</Heading>
          <Login />
        </Flex>
      </Box>
    </Container>
  );
};
