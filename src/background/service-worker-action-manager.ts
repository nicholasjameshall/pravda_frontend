import { GetAnnotationsRequest, GetAnnotationsResponse } from "../shared/get-annotations";
import { SaveAnnotationsRequest, SaveAnnotationsResponse } from "../shared/save-annotations";
import { ShowAnnotationsRequest, ShowAnnotationsResponse } from "../shared/show-annotations";
import { VoteAnnotationRequest, VoteAnnotationResponse } from "../shared/vote-annotation";
import { HttpService, HttpResponse } from "./http-service";

export class ServiceWorkerActionManager {
    private readonly httpService: HttpService;

    static readonly SHOW_ANNOTATIONS = "showAnnotations";
    private readonly GET_ANNOTATIONS_URL = "https://example.com/get_annotations";
    private readonly SAVE_ANNOTATIONS_URL = "https://example.com/save_annotations";
    private readonly VOTE_ANNOTATION_URL = "https://example.com/vote_annotation";

    constructor(httpService: HttpService) {
        this.httpService = httpService;
    }

    async showAnnotations(request: ShowAnnotationsRequest): Promise<ShowAnnotationsResponse> {
        console.log(request);
        return chrome.tabs.sendMessage(
            request.tabId,
            {
                method: ServiceWorkerActionManager.SHOW_ANNOTATIONS,
                data: request
            })
            .then(
                (response: ShowAnnotationsResponse) => response,
                () => { throw Error() });
    }

    async getAnnotations(request: GetAnnotationsRequest): Promise<GetAnnotationsResponse> {
        const httpRequest = { requestUrl: this.GET_ANNOTATIONS_URL, request: request };

        return this.httpService.get(httpRequest).then(
            (response: HttpResponse) => response.data);
    }

    async saveAnnotations(request: SaveAnnotationsRequest): Promise<SaveAnnotationsResponse> {
        const httpRequest = { requestUrl: this.SAVE_ANNOTATIONS_URL, request: request };

        return this.httpService.post(httpRequest).then(
            (response: HttpResponse) => response.data);
    }

    async voteAnnotation(request: VoteAnnotationRequest): Promise<VoteAnnotationResponse> {
        const httpRequest = { requestUrl: this.VOTE_ANNOTATION_URL, request: request };

        return this.httpService.post(httpRequest).then(
            (response: HttpResponse) => response.data);
    }

}