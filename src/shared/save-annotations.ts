import { TextAnnotation } from "./text-annotation";

export interface SaveAnnotationsRequest {
    url?: string;
    text: string;
    annotations: TextAnnotation[];
}

export interface SaveAnnotationsResponse {
    status: string;
}