import { TextAnnotationWithVotes } from "./text-annotation-with-votes";

export interface GetAnnotationsRequest {
    url: string;
}

export interface GetAnnotationsResponse {
    textsToAnnotations: [string, TextAnnotationWithVotes[]][];
}