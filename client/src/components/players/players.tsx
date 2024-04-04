import { Avatar, Heading, List, ListItem } from "@chakra-ui/react";
import { Player } from "../../types/player";

interface PlayersProps {
    players: Player[];
}

export function Players(props: PlayersProps) {
    console.log("Player IDs:", props.players.map(p => p.id));

    return (
        <>
            <Heading>Players</Heading>
            <List>
            {props.players.map((p) => (
              <ListItem key={p.id}>
                <Avatar src={p.avatar} />
                {p.displayName}
              </ListItem>
            ))}
            </List>
        </>
    )
}