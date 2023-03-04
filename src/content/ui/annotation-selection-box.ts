import { ContentActionManager } from "../content-action-manager";
import { TextAnnotation } from "../../shared/text-annotation";
import { SaveAnnotationsRequest } from "../../shared/save-annotations";
import { ElementBuilder } from "./shared/element-builder";

interface AnnotationOption {
    id: TextAnnotation;
    title: string;
    label: string;
}

export class AnnotationSelectionBox {
    private readonly element: HTMLElement;
    private selection: Selection | null;
    private checkboxes: HTMLInputElement[];
    private readonly elementBuilder: ElementBuilder;
    private readonly actionManager: ContentActionManager;

    get isHidden(): boolean {
        return this.element.style.display == "none";
    }

    private readonly SELECTION_BOX_CLASS = "selection-box";
    private readonly SELECTION_BOX_TITLE_CLASS = "selection-box-title";
    private readonly SELECTION_BOX_CONTENT_CLASS = "selection-box-content";
    private readonly SELECTION_BOX_ACTION_CLASS = "selection-box-action";
    private readonly SELECTION_BOX_BUTTON_CLASS = "selection-box-button";
    private readonly SELECTION_BOX_CHECKBOX_CLASS = "selection-box-checkbox";
    private readonly SELECTION_BOX_LOADING_GIF_CLASS = "selection-box-loading-gif";
    private readonly BUTTON_SUBMIT_TEXT = "SUBMIT";
    private readonly BUTTON_CLOSE_TEXT = "CLOSE";

    constructor(elementBuilder: ElementBuilder, actionManager: ContentActionManager) {
        this.elementBuilder = elementBuilder;
        this.actionManager = actionManager;
        this.selection = null;
        this.checkboxes = [];
        this.element = this.createAnnotationSelectionBoxElement();
    }

    getElement(): HTMLElement {
        return this.element;
    }
    
    display(selection: Selection): void {
        if (!this.element) {
            throw Error("Element not found");
        }

        this.resetCheckboxes();
        this.selection = selection;
        this.element.getElementsByClassName(
            this.SELECTION_BOX_TITLE_CLASS)[0].innerHTML = selection.toString();
        this.element.style.display = "inline";
    }

    hide(): void {
        if (!this.element) {
            return;
        }
        this.element.style.display = "none";
    }

    submitInput(): void {    
        const selectedAnnotations: TextAnnotation[] = this.checkboxes
        .filter((checkbox: HTMLInputElement) => checkbox.checked)
        .map((checkbox: HTMLInputElement) => {
          if (Object.values<string>(TextAnnotation).includes(checkbox.name)) {
              return <TextAnnotation>checkbox.name;
          }

          throw Error("Unrecognised text annotation");
        });

        if (this.selection == null || this.selection.toString().length == 0) {
            this.showError("Invalid selection");
            return;
        }

        if (selectedAnnotations.length == 0) {
            this.showError("No annotations selected");
            return;
        }

        this.disableButtons();
        this.showLoader();

        const request: SaveAnnotationsRequest = { 
            text: this.selection.toString(), annotations: selectedAnnotations };
    
        this.actionManager.saveAnnotations(request).then(
            () => {
                this.showSuccess();
                this.enableButtons();
                this.hideLoader(); 
            },
            () => { 
                this.showError("Could not save annotation");
                this.enableButtons();
                this.hideLoader();
            });
    }

    private showSuccess(): void {
        console.log("Success!")
    }

    private showError(error: string): void {
        console.log(error);
    }

    private disableButtons(): void {
        const buttons = <HTMLCollectionOf<HTMLInputElement>>this.element.getElementsByClassName(
            this.SELECTION_BOX_BUTTON_CLASS);
        for (let button of buttons) {
            button.disabled = true;
        }
    }

    private enableButtons(): void {
        const buttons = <HTMLCollectionOf<HTMLInputElement>>this.element.getElementsByClassName(
            this.SELECTION_BOX_BUTTON_CLASS);
        for (let button of buttons) {
            button.disabled = false;
        }
    }

    private showLoader(): void {
        const loadingGif = <HTMLImageElement>this.element.getElementsByClassName(
            this.SELECTION_BOX_LOADING_GIF_CLASS
        )[0];

        loadingGif.style.display = "block";

        console.log("Loading...");
    }

    private hideLoader(): void {
        const loadingGif = <HTMLImageElement>this.element.getElementsByClassName(
            this.SELECTION_BOX_LOADING_GIF_CLASS
        )[0];

        loadingGif.style.display = "none";

        console.log("Success!");
    }

    private resetCheckboxes(): void {
        for (let checkbox of this.checkboxes) {
            checkbox.checked = false;
        }
    }

    private createAnnotationSelectionBoxElement(): HTMLElement {
        const options: AnnotationOption[] = [
            {
                id: TextAnnotation.INACCURATE,
                title: "Inaccurate",
                label: "This statement is inaccurate"
            },
            {
                id: TextAnnotation.CONTAINS_BIAS,
                title: "Bias",
                label: "This statement contains bias"
            },
            {
                id: TextAnnotation.NO_SUPPORTING_EVIDENCE,
                title: "Unsupported",
                label: "This statement is unsupported by evidence"
            }
        ];

        const containerEl: HTMLElement = this.elementBuilder.createElement([this.SELECTION_BOX_CLASS]);
        const titleEl: HTMLElement = this.elementBuilder.createElement([this.SELECTION_BOX_TITLE_CLASS]);
        const contentEl: HTMLElement = this.elementBuilder.createElement([this.SELECTION_BOX_CONTENT_CLASS]);
        const actionEl: HTMLElement = this.elementBuilder.createElement([this.SELECTION_BOX_ACTION_CLASS]);

        const submitButton: HTMLInputElement = this.elementBuilder.createButton(
            this.BUTTON_SUBMIT_TEXT, [this.SELECTION_BOX_BUTTON_CLASS, "primary"]);
        submitButton.addEventListener('click', () => { this.submitInput() });

        const closeButton: HTMLInputElement = this.elementBuilder.createButton(
            this.BUTTON_CLOSE_TEXT, [this.SELECTION_BOX_BUTTON_CLASS, "secondary"]);
        closeButton.addEventListener('click', () => { this.hide() });

        const loadingGif: HTMLElement = this.elementBuilder.createLoadingGif(
            [this.SELECTION_BOX_LOADING_GIF_CLASS]);

        containerEl.appendChild(titleEl);
        containerEl.appendChild(contentEl);
        containerEl.appendChild(actionEl);

        for (let option of options) {
            const container = this.elementBuilder.createElement([]);
            const checkbox = this.elementBuilder.createCheckbox(
                option.id, option.title, [this.SELECTION_BOX_CHECKBOX_CLASS]);
            const label = this.elementBuilder.createCheckboxLabel(checkbox, option.label);

            this.checkboxes.push(checkbox);

            container.appendChild(checkbox);
            container.appendChild(label);

            contentEl.appendChild(container);
        }

        actionEl.appendChild(loadingGif);
        actionEl.appendChild(submitButton);
        actionEl.appendChild(closeButton);

        return containerEl;
    }
}