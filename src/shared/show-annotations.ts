import { TextAnnotationWithVotes } from "./text-annotation-with-votes";

export interface ShowAnnotationsRequest {
    tabId: number;
    textsToAnnotations: [string, TextAnnotationWithVotes[]][];
}

export interface ShowAnnotationsResponse {
    status: string;
}