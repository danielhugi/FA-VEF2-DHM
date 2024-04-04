import { Box, FormControl, FormLabel, Heading, Input, Stack, Button, HStack, IconButton, Radio, RadioGroup, Image, InputGroup, InputRightElement, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CloseIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { IRootState } from "../../redux/store";
import { createNewMatch } from "../../services/match-service";
import { getMatches, setMatches } from "../../redux/features/matches/matches-slice";
import { ThunkDispatch } from "@reduxjs/toolkit";

interface Question {
  title: string;
  options: Array<{ value: string; correct: boolean }>;
  correctOptionIndex?: number;
}
  

export function MatchCreateView() {
  const matches = useSelector((state: IRootState) => state.match.matches);
  const user = useSelector((state: IRootState) => state.user);
  const [title, setTitle] = useState('');
  const [titleImage, setTitleImage] = useState('');
  const [questions, setQuestions] = useState<Question[]>([{
    title: '',
    options: [{ value: '', correct: false }, { value: '', correct: false }, { value: '', correct: false }, { value: '', correct: false }],
    correctOptionIndex: undefined,
  }]);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

  async function createMatch() {
    setErrorMessage("");
    const match = {
      title, 
      titleImage,
      questions, 
      owner: user!,
      answers: [], 
      currentQuestion: 0,
      status: 'not-started' as "not-started" | "started" | "finished"
    };
    const newMatch = await createNewMatch(match);
  
    if (newMatch) {
      await dispatch(setMatches([...matches, newMatch]));
      dispatch(getMatches());
      navigate("/dashboard");
    } else {
      setErrorMessage("Failed to create the match.");
    }
  }

  const handleQuestionChange = (index: number, question: string) => {
    const newQuestions = [...questions];
    newQuestions[index].title = question;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex].value = value;
    setQuestions(newQuestions);
  };

  const handleCorrectOptionChange = (questionIndex: number, optionIndex: number) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].correctOptionIndex = optionIndex;
    newQuestions[questionIndex].options.forEach((option, i) => option.correct = i === optionIndex);
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, {
      title: '',
      options: [{ value: '', correct: false }, { value: '', correct: false }, { value: '', correct: false }, { value: '', correct: false }]
    }]);
  };

  const removeQuestion = (index: number) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setTitleImage(reader.result as string);
    };

    if (file) {
      reader.readAsDataURL(file);
    } else {
      setTitleImage('');
    }
  };

  const removeImage = () => {
    setTitleImage('');
  };

  return (
    <Box>
      <Heading>Create match</Heading>
      <Stack spacing={2}>
        <FormControl>
          <FormLabel>Title of the match</FormLabel>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter title of the match"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Match image</FormLabel>
          <InputGroup>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
            {titleImage && (
              <InputRightElement>
                <IconButton
                  aria-label="Remove image"
                  icon={<CloseIcon />}
                  onClick={removeImage}
                />
              </InputRightElement>
            )}
          </InputGroup>
          {titleImage && (
            <Image src={titleImage} alt="Match" boxSize="200px" objectFit="cover" mt={2} />
          )}
        </FormControl>
        <Button onClick={addQuestion}>Add Question</Button>
        {questions.map((question, qIndex) => (
          <Box key={qIndex}>
            <Heading size="md">Question {qIndex + 1}</Heading>
            <FormControl>
              <FormLabel>Title of the question</FormLabel>
              <Input
                type="text"
                value={question.title}
                onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                placeholder="Enter the title of the question"
              />
            </FormControl>
            <RadioGroup onChange={(value) => handleCorrectOptionChange(qIndex, parseInt(value))} value={question.correctOptionIndex?.toString()}>
              {question.options.map((option, oIndex) => (
                <HStack key={oIndex} align="start">
                  <FormControl>
                    <FormLabel>Answer {oIndex + 1}</FormLabel>
                    <Input
                      type="text"
                      value={option.value}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                      placeholder="Enter the answer"
                    />
                  </FormControl>
                  <Radio value={oIndex.toString()} />
                </HStack>
              ))}
            </RadioGroup>
            <Button onClick={() => removeQuestion(qIndex)}>Remove Question</Button>
          </Box>
        ))}

        <Button onClick={createMatch}>Save</Button>
        <Text>{errorMessage}</Text>
      </Stack>
    </Box>
  );
}