import { useSelector } from "react-redux"
import { IRootState } from "../../redux/store"
import { Image, Box, Card, CardBody, CardHeader, Heading, Stack, StackDivider } from "@chakra-ui/react"
import { useNavigate } from "react-router-dom";

export function MatchList() {
  const match = useSelector((state: IRootState) => state.match);
  const navigate = useNavigate();
  function navigateToMatch(id: string) {
      navigate(`/matches/${id}`);
  }
  console.log("matchid" + match.matches.map(m => m._id));
  return (
    <Box sx={{
        width: "100%",
        maxWidth: 360,
    }}>
      {match.matches.map((m) => (
        <Card key={m._id} onClick={() => navigateToMatch(m._id)} marginTop={5} marginBottom={5}>
          <CardBody>
              <CardHeader>
                <Heading size='md'>{m.title}</Heading>
              </CardHeader>
              <CardBody>
                <Stack divider={<StackDivider />} spacing='4'>
                  <Box>
                    <Image src={m.titleImage} alt={m.title} boxSize="100px" objectFit="cover" />
                  </Box>
                  <Box>
                    <Heading size='xs' textTransform='uppercase'>
                      {`Players: ${m.players?.length ?? 0}/4`}
                    </Heading>
                  </Box>
                </Stack>
              </CardBody>
          </CardBody>
        </Card>
      ))}
    </Box>
  )
}