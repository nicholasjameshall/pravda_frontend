enum ElementType {
    DIV = "div",
    INPUT = "input",
    LABEL = "label",
    IMG = "img"
}

export class ElementBuilder {

    private readonly ATTRIBUTE_ID = "id";
    private readonly ATTRIBUTE_TYPE = "type";
    private readonly ATTRIBUTE_NAME = "name";
    private readonly ATTRIBUTE_FOR = "for";
    private readonly LOADING_GIF_SRC = "/rsc/loading.gif"
    private readonly LOADING_GIF_CLASS = "loader";

    createElement(classes: string[], textContent?: string): HTMLElement {
        const newEl = document.createElement(ElementType.DIV);
        this.addClasses(newEl, classes);
        newEl.innerHTML = textContent ?? "";
        return newEl;
    }

    createLoadingGif(classes: string[]): HTMLElement {
        const gifContainer: HTMLElement = this.createElement(classes);
        const gif: HTMLElement = this.createElement([this.LOADING_GIF_CLASS]);
        /*const newGif: HTMLImageElement = document.createElement(ElementType.IMG);
        this.addClasses(newGif, [this.LOADING_GIF_CLASS]);
        newGif.src = chrome.runtime.getURL(this.LOADING_GIF_SRC); */
        gifContainer.appendChild(gif);
        return gifContainer;
    }

    createButton(value: string, classes: string[]): HTMLInputElement {
        const newButton = document.createElement(ElementType.INPUT);
        newButton.setAttribute(this.ATTRIBUTE_TYPE, "button");
        this.addClasses(newButton, classes);
        newButton.value = value;

        return newButton;
    }

    createCheckbox(id: string, value: string, classes: string[]): HTMLInputElement {
        const newCheckbox = document.createElement(ElementType.INPUT);
        this.addClasses(newCheckbox, classes);
        newCheckbox.setAttribute(this.ATTRIBUTE_TYPE, "checkbox");
        newCheckbox.setAttribute(this.ATTRIBUTE_ID, id);
        newCheckbox.setAttribute(this.ATTRIBUTE_NAME, id);
        newCheckbox.value = value;

        return newCheckbox;
    }

    createCheckboxLabel(checkbox: Element, labelText: string): HTMLElement {
        const newLabel = document.createElement(ElementType.LABEL);
        const checkboxId: string | null = checkbox.getAttribute(this.ATTRIBUTE_ID);

        if (checkboxId == null) {
            throw Error("Invalid checkbox");
        }

        newLabel.setAttribute(this.ATTRIBUTE_FOR, checkboxId);
        newLabel.textContent = labelText;

        return newLabel;
    }

    private addClasses(el: Element, classes: string[]) {
        for (let className of classes) {
            if (className == "") {
                continue;
            }
            el.classList.add(className);
        }
    }
}