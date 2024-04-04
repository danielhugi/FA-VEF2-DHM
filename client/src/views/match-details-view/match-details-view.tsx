import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { IRootState } from "../../redux/store";
import { socket } from "../../services/socket-service";
import { Box, Button, Heading, Stack } from "@chakra-ui/react";
import { Players } from "../../components/players/players";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { setMatches } from "../../redux/features/matches/matches-slice";
import { fetchWithCredentials } from "../../utilities/fetch-utilities";

export default function MatchDetailsView() {
    const { matchId } = useParams();
    const match = useSelector((state: IRootState) =>
        state.match.matches.find((m) => m._id === matchId)
    );
    const user = useSelector((state: IRootState) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();


    const joinMatch = () => socket.emit("joinmatch", matchId, user);

    function startMatch() {
        if (match && match.players.length >= 2 && match.players.length <= 4) {
            socket.emit("startmatch", matchId);
            navigate(`/game/${matchId}`);
        }
    }

    function leaveMatch() {
      socket.emit("leavematch", matchId, user);
      socket.on("leavematch", async (data) => {
        if (data._id === user._id) {
          const response = await fetchWithCredentials(`matches/${matchId}`);
          const updatedMatch = await response.json();
          dispatch(setMatches(updatedMatch));
        }
      });
      return () => {
        socket.off("leavematch");
      }
    }

    // Bara owner getur startað match, þarf að breyta þessu logic í creator eða host
    const isHost = match && match.owner._id === user._id;
    const canStartMatch = match && match.players.length >= 2 && match.players.length <= 4;

    console.log("Match Players Detailed:", JSON.stringify(match?.players, null, 2));

    return match ? (
        <Box>
            <Heading>{match.title}</Heading>
            <Stack direction="row" spacing={4} marginTop={5} marginBottom={5}>
                <Button onClick={() => joinMatch()} disabled={match.status !== 'not-started'}>Join Match</Button>
                <Button onClick={leaveMatch} colorScheme="red">Leave Match</Button>
                {isHost && (
                    <Button onClick={startMatch} colorScheme="blue" isDisabled={!canStartMatch}>
                        Start Match
                    </Button>
                )}
            </Stack>
            <Box mt={4}>
                <strong>Players:</strong> {match.players.length} / 4
            </Box>
            {match.players ? (
                <Players players={match.players} />
            ) : (
                <div>Loading players...</div>
            )}
        </Box>
    ) : (
        <Heading>Loading...</Heading>
    );
}
