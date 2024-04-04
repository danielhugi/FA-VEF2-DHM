import { Avatar, Box, Flex, Text, Button } from "@chakra-ui/react";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { getUser, logoutUser } from "../services/user-service";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../redux/store";
import { setUser } from "../redux/features/user/user-slice";
import { getMatches, setMatches } from "../redux/features/matches/matches-slice";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { socket } from "../services/socket-service";

export function MainLayout() {
    const user = useSelector((state: IRootState) => state.user);
    const match = useSelector((state: IRootState) => state.match);
    const navigate = useNavigate();
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

    useEffect(() => {
        dispatch(getMatches());
    }, [dispatch])

    useEffect(() => {
        async function validateUserSession() {
            if (Object.keys(user).length > 0) {
                return;
            }

            const session = await getUser();

            if (!session) {
                navigate("/");
            } else {
                dispatch(setUser(session));
            }
        }

        validateUserSession();
    }, [dispatch, navigate, user])

    async function handleLogout() {
        const success = await logoutUser();
        if (success) {
            dispatch(setUser({}));
            navigate("/");
        } else {
            console.error('Logout failed');
        }
    }

    useEffect(() => {
    
        socket.on("joinmatch", (matchId, user) => {
          dispatch(
            setMatches(
              match.matches.map((m) => {
                if (m._id === matchId) {
                  return {
                    ...m,
                    players: [...m.players, user],
                  };
                }
                return m;
              })
            )
          );
        });
    
        return () => {
          socket.off("joinmatch");
        };
      }, [dispatch, match.matches]);

    return (
        <Flex height="100vh">
            <Box p="5" bg="gray.200" width="200px" display="flex" flexDirection="column" alignItems="center">
                <Avatar name={user.displayName} src={user.avatar} />
                <Text mt="4">{user.displayName}</Text>
                <Button mt="4" onClick={handleLogout}>Logout</Button>
            </Box>
            <Box flex="1" overflow="auto">
                <Outlet />
            </Box>
        </Flex>
    );
}