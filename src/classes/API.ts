import {ArticlePeerReviewed} from '@/classes/ArticlePeerReviewed';
import fetcher from '@/fetcher';

export class API {
    private jsonAPI: string = '/jsonapi/node/';
    private drupalAPI: string = '/node/';
    private drupalType: string = 'article/';
    private format: string = '';


    constructor() {
        // empty
    }

    public async getArticle(drupalNodeID: string): Promise<any> {
        return await this.fetchUUID(drupalNodeID)
            .then((uuid: string) => {
                return this.fetchArticleByUUID(uuid)
                    .then((fetchedArticle: ArticlePeerReviewed) => {
                        return fetchedArticle;
                    })
                    .catch();
            })
            .catch();


        // const articleJSON = fetch('http://localhost:8888/plenum-drupal-dev/drupal-8.5.3/api/pubs/'
        //     + this.year
        //     + '?_format=json')
        //     .then((response) =>
        //         response.json().then((data) => ({
        //                 data,
        //                 status: response.status,
        //             }),
        //         ).then((res) => {
        //             this.parseData(res.data[this.articleId]);
        //         }))
        //    .catch();
        // Throw DOM display that article does not exist
    }


    private async fetchUUID(nodeID: string): Promise<any> {
        return await fetcher({
            url: this.drupalAPI + nodeID,
            params: {
                _format: 'json',
            },
            timeout: 1000,
            // socketPath: ,
        }).then((response) => {
            return response.data.uuid[0].value;
        });
    }

    private async fetchArticleByUUID(uuid: string): Promise<any> {
        return await fetcher( {
            url: this.jsonAPI + this.drupalType + uuid,
            params: {
                _format: 'json',
            },
            timeout: 1000,
        }).then((response) => {
            return this.parseData(response.data.data);
        });
    }

    private parseData(data: any): ArticlePeerReviewed {
        return new ArticlePeerReviewed(
            data.attributes.field_title, // Title
            data.attributes.field_author, // Author
            data.attributes.field_abstract, // Abstract
            data.attributes.body[0].processed, // Text body
            data.attributes.field_references.processed,
            '',
            // data.relationships.field_download_.data, // Download URL
            data.attributes.field_copyright,
            'University of Washington', // University
            'Department of Geography', // School
            data.attributes.field_subtitle, // Subtitle
        );
    }
}
