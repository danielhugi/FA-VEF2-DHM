import React, { useEffect, useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { socket } from '../../services/socket-service';
import { resetMatchState, setMatch } from '../../redux/features/match-state/match-state-slice';
import { IRootState } from '../../redux/store';
import { Box, Button, Heading, Text } from '@chakra-ui/react';

interface Option {
  value: string;
}

const MatchRoomView: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const matchState = useSelector((state: IRootState) => state.matchState);
  const matches = useSelector((state: IRootState) => state.match.matches);
  const match = matchState.match || matches.find(m => m._id === matchId);
  const user = useSelector((state: IRootState) => state.user);

  const [timer, setTimer] = useState(10);

  useEffect(() => {
    if (match) {
      dispatch(setMatch(match));
    }
  }, [dispatch, match]);

  useEffect(() => {
    console.log('Match state:', matchState);
    console.log('Match data:', match);
  }, [matchState, match]);

  useEffect(() => {
    socket.on('finishedgame', () => {
      navigate(`/match/review/${matchId}`);
    });

    socket.on('answer', (updatedMatch, user) => {
        console.log('Received updated match:', updatedMatch);
        dispatch(setMatch(updatedMatch));
    });

    socket.on('startmatch', () => {
      setTimer(10);
      const interval = setInterval(() => {
        setTimer(prevTimer => prevTimer > 0 ? prevTimer - 1 : 0);
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    });

    return () => {
      socket.off('finishedgame');
      socket.off('answer');
      socket.off('startmatch');
      dispatch(resetMatchState());
    };
  }, [dispatch, matchId, navigate]);

  const handleNextQuestion = useCallback(() => {
    socket.emit('nextquestion', matchId);
  }, [matchId]);

  const handleFinishMatch = useCallback(() => {
    socket.emit('finishmatch', matchId);
  }, [matchId]);

  const handleAnswer = useCallback((option: Option, index: number) => {
    console.log('Emitting answer event with parameters:', match, user, index);
    socket.emit('answer', match, user, index);
  }, [match, user]);

  const isOwner = user?._id === match?.owner._id;
  const currentQuestionAnswer = match && match.answers.find(answer => answer.question === match.currentQuestion);

  return (
    <Box p="5">
      <Heading mb="4">Match: {match?.title}</Heading>
      <Text position="absolute" top="0" right="0">{timer}</Text>
      {matchState.currentQuestionIndex}
      {match?.questions.length}
      {match && match.questions.length > matchState.currentQuestionIndex ? (
        <>
          <Text fontSize="xl" mb="2">Question: {match.questions[matchState.currentQuestionIndex].title}</Text>
          <Box>
            {match.questions[matchState.currentQuestionIndex].options.map((option, index) => (
              <Button key={index} m="1" onClick={() => handleAnswer(option, index)}>{option.value}</Button>
            ))}
          </Box>
          {currentQuestionAnswer && <img src={currentQuestionAnswer.user.avatar} alt="User Avatar" />}
          {isOwner && (
            <Box mt="4">
              <Button mr="2" colorScheme="blue" onClick={handleNextQuestion}>Next Question</Button>
              {match.questions.length - 1 === matchState.currentQuestionIndex && (
                <Button colorScheme="green" onClick={handleFinishMatch}>Finish Match</Button>
              )}
            </Box>
          )}
        </>
      ) : (
        <Text>Waiting for the next question...</Text>
      )}
    </Box>
  );

};

export default MatchRoomView;