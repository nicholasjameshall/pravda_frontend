import { GetAnnotationsRequest, GetAnnotationsResponse } from "../shared/get-annotations";
import { ContentAction, ContentActionManager } from "../content/content-action-manager";
import { SaveAnnotationsRequest, SaveAnnotationsResponse } from "../shared/save-annotations";
import { ShowAnnotationsRequest, ShowAnnotationsResponse } from "../shared/show-annotations";
import { ServiceWorkerActionManager } from "./service-worker-action-manager";
import { HttpService } from "./http-service";
import { VoteAnnotationRequest, VoteAnnotationResponse } from "../shared/vote-annotation";

const httpService = new HttpService();
const actionManager = new ServiceWorkerActionManager(httpService);

chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
    if (message.method == ContentAction.SAVE_ANNOTATIONS) {
        const request: SaveAnnotationsRequest = message.data;
        console.log(request);

        actionManager.saveAnnotations(request)
            .then((response: SaveAnnotationsResponse) => {
                sendResponse(response)
            });
    }
    
    if (message.method == ContentAction.VOTE_ANNOTATION) {
        const request: VoteAnnotationRequest = message.data;
        console.log(request);

        actionManager.voteAnnotation(request)
            .then((response: VoteAnnotationResponse) => {
                sendResponse(response);
            });
    }
});

chrome.action.onClicked.addListener((tab) => {
    const tabId: number = tab.id ? tab.id : -1;
    const tabUrl: string = tab.url ? tab.url : "";

    if (tabId == -1 || tabUrl == "") {
        throw Error("Can't find tab");
    }

    const request: GetAnnotationsRequest = {
        url: tabUrl
    };

    actionManager.getAnnotations(request)
        .then((response: GetAnnotationsResponse) => {
                const request: ShowAnnotationsRequest = { 
                    tabId: tabId,
                    textsToAnnotations: response.textsToAnnotations };

                return actionManager.showAnnotations(request); 
            })
        .then((response: ShowAnnotationsResponse) => console.log(response) );
  });