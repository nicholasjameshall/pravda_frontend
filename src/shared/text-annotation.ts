export enum TextAnnotation {
    CONTAINS_BIAS = "containsBias",
    INACCURATE = "inaccurate",
    NO_SUPPORTING_EVIDENCE = "noSupportingEvidence"
}

export function toHumanFriendlyText(annotation: TextAnnotation) {
    switch(annotation) {
        case (TextAnnotation.CONTAINS_BIAS):
            return "Contains bias";
        case (TextAnnotation.INACCURATE):
            return "Inaccurate";
        case (TextAnnotation.NO_SUPPORTING_EVIDENCE):
            return "No supporting evidence";
        default:
            throw Error("Text annotation not found");
    }
}