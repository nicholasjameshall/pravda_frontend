import { SaveAnnotationsRequest, SaveAnnotationsResponse } from "../shared/save-annotations";
import { VoteAnnotationRequest, VoteAnnotationResponse } from "../shared/vote-annotation";

export enum ContentAction {
  SAVE_ANNOTATIONS = "saveAnnotations",
  VOTE_ANNOTATION = "voteAnnotation"
}

export class ContentActionManager {
    constructor() {}

    async saveAnnotations(request: SaveAnnotationsRequest): Promise<SaveAnnotationsResponse> {
        const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
        await delay(2000);
        return this.sendRequestToServiceWorker(request, ContentAction.SAVE_ANNOTATIONS)
          .then((response: SaveAnnotationsResponse) => response);
    }

    async voteAnnotation(request: VoteAnnotationRequest): Promise<VoteAnnotationResponse> {
      const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
      await delay(2000);
      return this.sendRequestToServiceWorker(request, ContentAction.VOTE_ANNOTATION)
          .then((response: VoteAnnotationResponse) => response);
    }

    private async sendRequestToServiceWorker(request: any, method: ContentAction): Promise<any> {
      return chrome.runtime.sendMessage({
        method,
        data: request
      })
      .then((response) => response);
    }
}