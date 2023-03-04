import { AnnotationSelectionBox } from './ui/annotation-selection-box';
import { ShowAnnotationsRequest, ShowAnnotationsResponse } from '../shared/show-annotations';
import { AnnotationRenderer } from './ui/annotation-renderer';
import { ServiceWorkerActionManager } from '../background/service-worker-action-manager';
import { ElementBuilder } from './ui/shared/element-builder';
import { ContentActionManager } from './content-action-manager';
import { TextAnnotationWithVotes } from '../shared/text-annotation-with-votes';

const elementBuilder: ElementBuilder = new ElementBuilder();
const actionManager: ContentActionManager = new ContentActionManager();

const selectionBox = new AnnotationSelectionBox(elementBuilder, actionManager);
const selectionBoxEl = selectionBox.getElement();
document.body.appendChild(selectionBoxEl);

const annotationsRenderer: AnnotationRenderer = new AnnotationRenderer(
    elementBuilder, actionManager);
const annotationBoxEl = annotationsRenderer.getElement();
document.body.appendChild(annotationBoxEl);

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
    if (message.method == ServiceWorkerActionManager.SHOW_ANNOTATIONS) {
        const request: ShowAnnotationsRequest = message.data;
        annotationsRenderer.showAnnotations(
            new Map<string, TextAnnotationWithVotes[]>(request.textsToAnnotations));

        const response: ShowAnnotationsResponse = { 
            status: "Success"
        };
        
        sendResponse(response);
    } else {
        throw new Error("Content script endpoint not found");
    }
});

document.addEventListener('mouseup', (event) => {
    const selection: Selection | null = window.getSelection();
    const clickWithinInputBox = event.composedPath().includes(selectionBoxEl);

    if (!selectionBox.isHidden && !clickWithinInputBox) {
        selectionBox.hide();
    } else if (selectionBox.isHidden && selection && isValidSelection(selection)) {
        selectionBox.display(selection);
    }
});

function isValidSelection(selection: Selection | null): boolean {
    if(!selection || !selection.toString() || selection.toString.length > 200) {
        return false;
    }

    return true;
}