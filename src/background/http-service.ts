import { GetAnnotationsResponse } from "../shared/get-annotations";
import { TextAnnotation } from "../shared/text-annotation";
import { VoteType } from "../shared/vote-annotation";

export interface HttpRequest {
    requestUrl: string;
    request: any;
}

export interface HttpResponse {
    data: any;
}

export class HttpService {
    constructor() {}

    async get(request: HttpRequest): Promise<HttpResponse> {
        /* var serviceCall = 'http://www.google.com/search?q=' + selectedText;
        chrome.tabs.create({url: serviceCall}); */

        const fakeServerResponse: GetAnnotationsResponse = {
            textsToAnnotations: [
                [
                    "Earlier this month Mr Biden's lawyers said a first batch",
                    [
                        {
                            annotation: TextAnnotation.CONTAINS_BIAS,
                            votes: 500,
                            userSelection : VoteType.DOWNVOTE
                        },
                        {
                            annotation: TextAnnotation.INACCURATE,
                            votes: 250,
                            userSelection : VoteType.UPVOTE
                        }
                    ]
                ],
                [
                    "second batch of records was found",
                    [
                        {
                            annotation: TextAnnotation.NO_SUPPORTING_EVIDENCE,
                            votes: 750,
                            userSelection : VoteType.UPVOTE
                        },
                        {
                            annotation: TextAnnotation.CONTAINS_BIAS,
                            votes: 200,
                            userSelection : VoteType.UPVOTE
                        },
                        {
                            annotation: TextAnnotation.INACCURATE,
                            votes: -55,
                            userSelection : VoteType.NO_VOTE
                        }
                    ]
                ],
                [
                    "Penn Biden Center",
                    [
                        {
                            annotation: TextAnnotation.CONTAINS_BIAS,
                            votes: -200,
                            userSelection : VoteType.NO_VOTE
                        }
                    ]
                ]
            ]
        };

        const httpResponse: HttpResponse = { data: fakeServerResponse };
        return new Promise<HttpResponse>((resolve) => resolve(httpResponse));
    }

    async post(request: HttpRequest): Promise<HttpResponse> {
        const httpResponse: HttpResponse = { data: { status: "Success!" } };
        return new Promise<HttpResponse>((resolve) => resolve(httpResponse));
    }

}