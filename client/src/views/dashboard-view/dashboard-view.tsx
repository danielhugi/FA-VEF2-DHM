import { Box, Button, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { MatchList } from "../../components/match-list/match-list";

export function DashboardView() {
    const navigate = useNavigate();
    return (
        <Box>
            <Heading>Dashboard</Heading>
            <Box marginTop={5}>
                <Button onClick={() => navigate("/matches/create")}>Create new match</Button>
                <MatchList />
            </Box>
        </Box>
    )
}