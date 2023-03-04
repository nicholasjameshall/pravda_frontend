import { TextAnnotation } from "./text-annotation";
import { VoteType } from "./vote-annotation";

export interface TextAnnotationWithVotes {
    annotation: TextAnnotation;
    votes: number;
    userSelection: VoteType;
}