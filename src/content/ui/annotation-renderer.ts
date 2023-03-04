import { TextAnnotation, toHumanFriendlyText } from "../../shared/text-annotation";
import { TextAnnotationWithVotes } from "../../shared/text-annotation-with-votes";
import { VoteAnnotationRequest, VoteType } from "../../shared/vote-annotation";
import { ContentActionManager } from "../content-action-manager";
import { ElementBuilder } from "./shared/element-builder";

interface TextWithTextLocation {
    text: string;
    location: TextLocation;
}

interface TextLocation {
    el: Element;
    startPos: number;
    endPos: number;
}

export class AnnotationRenderer {
    private readonly element: HTMLElement;
    private readonly elementBuilder: ElementBuilder;
    private readonly actionsManager: ContentActionManager;

    private readonly ANNOTATION_BOX_CLASS = "annotation-box";
    private readonly ANNOTATION_BOX_TITLE_CLASS = "annotation-box-title";
    private readonly ANNOTATION_BOX_CONTENT_CLASS = "annotation-box-content";
    private readonly ANNOTATION_BOX_ACTIONS_CLASS = "annotation-box-actions";
    private readonly ANNOTATION_BOX_BUTTON_CLASS = "annotation-box-button";
    private readonly ANNOTATION_BOX_LOADING_GIF_CLASS = "annotation-box-loading-gif"
    private readonly ANNOTATION_BOX_ROW_CLASS = "annotation-box-row";
    private readonly ANNOTATION_BOX_COL_SMALL_CLASS = "annotation-box-col-small";
    private readonly ANNOTATION_BOX_COL_LARGE_CLASS = "annotation-box-col-large";
    private readonly ANNOTATION_BOX_VOTE_CLASS = "annotation-box-vote";
    private readonly ANNOTATION_BOX_SELECTED_CLASS = "selected";
    private readonly ANNOTATION_BOX_ACTION_SUCCESS_CLASS = "success-icon-container";
    private readonly ANNOTATION_BOX_ACTION_FAILURE_CLASS = "failure-icon-container";
    private readonly BUTTON_CLOSE_TEXT = "CLOSE";
    private readonly ELEMENT_TYPE_PARAGRAPH = "P";

    constructor(elementBuilder: ElementBuilder, actionsManager: ContentActionManager) {
        this.elementBuilder = elementBuilder;
        this.actionsManager = actionsManager;
        this.element = this.createAnnotationBoxElement();
    }

    getElement(): HTMLElement {
        return this.element;
    }

    showAnnotations(textsToAnnotations: Map<string, TextAnnotationWithVotes[]>): void {
        const textsToFind = Array.from(textsToAnnotations.keys());
        const root: HTMLElement = document.body;
        const textsFoundOnPage: Map<string, TextLocation> = new Map(
            this.getElementsWithText(root, textsToFind)
                .filter((textAndLocation: TextWithTextLocation) => 
                    textAndLocation.location.el.tagName == this.ELEMENT_TYPE_PARAGRAPH)
                .map((textAndLocation: TextWithTextLocation) => 
                    [textAndLocation.text, textAndLocation.location]));
        for (let [text, annotationsWithVotes] of textsToAnnotations.entries()) {
            if (textsFoundOnPage.has(text)) {
                const location: TextLocation = textsFoundOnPage.get(text)!;
                this.highlightText(text, location, annotationsWithVotes);
            }
        }
    }

    private voteAnnotation(text: string, annotation: TextAnnotation, type: VoteType): void {
        this.showLoader();

        const request: VoteAnnotationRequest = {
            text,
            annotation,
            type
        };
        this.actionsManager.voteAnnotation(request)
            .then((resp) => {
                this.hideLoader();
                this.showSuccess();
                console.log(resp)
            });
    }

    private createAnnotationBoxElement(): HTMLElement {
        const container: HTMLElement = this.elementBuilder.createElement(
            [this.ANNOTATION_BOX_CLASS]);
        const title: HTMLElement = this.elementBuilder.createElement(
            [this.ANNOTATION_BOX_TITLE_CLASS]);
        const content: HTMLElement = this.elementBuilder.createElement(
            [this.ANNOTATION_BOX_CONTENT_CLASS]);
        const actions: HTMLElement = this.elementBuilder.createElement(
            [this.ANNOTATION_BOX_ACTIONS_CLASS]);
        const closeButton: HTMLInputElement = this.elementBuilder.createButton(
            this.BUTTON_CLOSE_TEXT, [this.ANNOTATION_BOX_BUTTON_CLASS, "secondary"]);
        closeButton.addEventListener('click', () => { this.hide() });
        const loadingGif: HTMLElement = this.elementBuilder.createLoadingGif(
            [this.ANNOTATION_BOX_LOADING_GIF_CLASS]);
        const successIcon: HTMLElement = this.elementBuilder.createElement(
            [this.ANNOTATION_BOX_ACTION_SUCCESS_CLASS], "✓")

        actions.appendChild(loadingGif);
        actions.appendChild(successIcon);
        actions.appendChild(closeButton);
        container.appendChild(title);
        container.appendChild(content);
        container.appendChild(actions);

        return container;
    }

    private highlightText(
        text: string, loc: TextLocation, annotationsWithVotes: TextAnnotationWithVotes[]): void {
        const start: string = loc.el.innerHTML.substring(0, loc.startPos);
        const mid: string = loc.el.innerHTML.substring(loc.startPos, loc.endPos);
        const end: string = loc.el.innerHTML.substring(loc.endPos);
        loc.el.innerHTML = start + "<span style='color:red; cursor:pointer'>" + mid + "</span>" + end;
        loc.el.addEventListener('click', () => {
            this.showAnnotationsBox(text, annotationsWithVotes);
        });
    }

    private showAnnotationsBox(
        text: string, annotationsWithVotes: TextAnnotationWithVotes[]): void {
        const title: HTMLElement = <HTMLElement>this.element.getElementsByClassName(
            this.ANNOTATION_BOX_TITLE_CLASS)[0];
        const contentContainer: HTMLElement = <HTMLElement>this.element.getElementsByClassName(
            this.ANNOTATION_BOX_CONTENT_CLASS)[0];
        title.innerHTML = text;
        contentContainer.innerHTML = "";

        const rows: HTMLElement[] = annotationsWithVotes.map((annotation) => {
            const row = this.elementBuilder.createElement(
                [this.ANNOTATION_BOX_ROW_CLASS]);
            const voteCounterContainer = this.elementBuilder.createElement(
                [this.ANNOTATION_BOX_COL_SMALL_CLASS],
                annotation.votes.toString());
            const annotationTextContainer = this.elementBuilder.createElement(
                [this.ANNOTATION_BOX_COL_LARGE_CLASS],
                toHumanFriendlyText(annotation.annotation));
            const upvoteContainer = this.elementBuilder.createElement(
                [this.ANNOTATION_BOX_COL_SMALL_CLASS]);
            const upvote = this.elementBuilder.createElement(
                [
                    this.ANNOTATION_BOX_VOTE_CLASS,
                    annotation.userSelection == VoteType.UPVOTE ? this.ANNOTATION_BOX_SELECTED_CLASS : ""
                ], "&#128077;");
            upvote.addEventListener('click', () => {
                this.voteAnnotation(
                    "Hello",
                    annotation.annotation,
                    VoteType.UPVOTE);
            });
            const downvoteContainer = this.elementBuilder.createElement(
                [this.ANNOTATION_BOX_COL_SMALL_CLASS]);
            const downvote = this.elementBuilder.createElement(
                [
                    this.ANNOTATION_BOX_VOTE_CLASS,
                    annotation.userSelection == VoteType.DOWNVOTE ?
                        this.ANNOTATION_BOX_SELECTED_CLASS : ""
                ], "&#128078;");
            downvote.addEventListener('click', () => {
                this.voteAnnotation(
                    "Hello",
                    annotation.annotation,
                    VoteType.DOWNVOTE);
            });

            upvoteContainer.appendChild(upvote);
            downvoteContainer.appendChild(downvote);

            row.appendChild(annotationTextContainer);
            row.appendChild(upvoteContainer);
            row.appendChild(downvoteContainer);
            row.appendChild(voteCounterContainer);

            return row;
        });

        for (let row of rows) {
            contentContainer.appendChild(row);
        }

        this.display();
    }

    private hide() {
        this.element.style.display = "none";
    }

    private display() {
        this.element.style.display = "inline";
    }

    private showLoader(): void {
        const loadingGif = <HTMLImageElement>this.element.getElementsByClassName(
            this.ANNOTATION_BOX_LOADING_GIF_CLASS
        )[0];

        loadingGif.style.display = "block";

        console.log("Loading...");
    }

    private hideLoader(): void {
        const loadingGif = <HTMLImageElement>this.element.getElementsByClassName(
            this.ANNOTATION_BOX_LOADING_GIF_CLASS
        )[0];

        loadingGif.style.display = "none";

        console.log("Waiting over!");
    }

    private async showSuccess(): Promise<void> {
        const success = <HTMLImageElement>this.element.getElementsByClassName(
            this.ANNOTATION_BOX_ACTION_SUCCESS_CLASS
        )[0];

        success.style.display = "block";

        const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
        await delay(4000);

        success.style.display = "none";

        console.log("Success!");
    }

    private async showFailure(): Promise<void> {
        const failure = <HTMLImageElement>this.element.getElementsByClassName(
            this.ANNOTATION_BOX_ACTION_FAILURE_CLASS
        )[0];

        failure.style.display = "block";

        const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
        await delay(2000);

        failure.style.display = "none";

        console.log("Failure!");
    }

    private elementContainsText(el: HTMLElement, text: string): boolean {
        return el.textContent != null && el.textContent.indexOf(text) >= 0;
    }

    private toTextWithTextLocation(el: HTMLElement, text: string): TextWithTextLocation {
        const startPos: number = el.textContent!.indexOf(text);

        return {
            text: text,
            location: {
                el: el,
                startPos: startPos,
                endPos: startPos + text.length
            }
        };
    }

    private getTextsInElement(el: HTMLElement, textsToFind: string[]): TextWithTextLocation[] {
        return textsToFind
            .filter((text) => this.elementContainsText(el, text))
            .map((text) => this.toTextWithTextLocation(el, text));
    }
    
    private getElementsWithText(
        el: HTMLElement, textsToFind: string[]): TextWithTextLocation[] {

        // If we've reached the bottom of a branch
        if(el.firstElementChild == null) {
            return this.getTextsInElement(el, textsToFind);
        }
    
        let textsAndLocations: TextWithTextLocation[] = [];

        el = <HTMLElement>el.firstElementChild;
    
        while (el) {
            textsAndLocations = textsAndLocations.concat(
                this.getElementsWithText(el, textsToFind));
            el = <HTMLElement>el.nextElementSibling;
        }
    
        return textsAndLocations;
    }
}