import { TextAnnotation } from "./text-annotation";

export enum VoteType {
    UPVOTE,
    DOWNVOTE,
    NO_VOTE
}

export interface VoteAnnotationRequest {
    url?: string;
    text: string;
    annotation: TextAnnotation;
    type: VoteType;
}

export interface VoteAnnotationResponse {
    status: string;
}