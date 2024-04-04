import { Player } from "./player";
import { User } from "./user";

export interface Match {
  _id: string;
  title: string;
  titleImage: string;
  questions: Array<{
    title: string;
    options: Array<{
      value: string;
      correct: boolean;
    }>;
  }>;
  owner: Partial<User>;
  answers: Array<{
    question: number;
    user: Partial<User>;
    answer: number;
    secondsLeft: number;
  }>;
  currentQuestion: number;
  players: Player[];
  status: 'not-started' | 'started' | 'finished';
}