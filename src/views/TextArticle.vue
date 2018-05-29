<template>
    <div id="text-article">
        Text Article {{this.$route.params.article_id}} of Edition {{this.$route.params.id}}
        <br>
        <h1>
            {{this.article.title}}:
        </h1>
        <h2>
            {{this.article.subtitle}}
        </h2>
        <p>
            <strong>Abstract:</strong> {{this.article.abstract}}
        </p>
        <br>
        <br>
        <p v-html="this.article.body"></p>
    </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import { Route } from 'vue-router';
import { ArticlePeerReviewed } from '@/classes/ArticlePeerReviewed';

@Component({
    components: {

    },
})

export default class Article extends Vue {
    private $route: Route;
    private year: string;
    private articleId: number;
    @Prop() private article: ArticlePeerReviewed;

    constructor() {
        super();


    }

    public mounted() {
        // https://github.com/nuxt-community/typescript-template/issues/23
        this.year = this.$route.params.id;
        this.articleId = this.$route.params.article_id - 1;

        this.getArticle(this.year, this.articleId);
    }

    private getArticle(year: string, articleId: number) {
        const articleJSON = fetch('http://localhost:8888/plenum-drupal-dev/drupal-8.5.3/api/pubs/'
            + this.year
            + '?_format=json')
            .then((response) =>
                response.json().then((data) => ({
                    data,
                    status: response.status,
                }),
                ).then((res) => {
                    this.parseData(res.data[this.articleId]);
                }))
            .catch();
        // Throw DOM display that article does not exist
    }

    private parseData(data) {
        this.article = new ArticlePeerReviewed(
            data.field_title[this.articleId].value,
            data.field_author[this.articleId].value,
            data.field_abstract[this.articleId].value,
            data.body[this.articleId].processed,
            'University of Washington',
            'Department of Geography',
            data.field_subtitle[this.articleId].value,
        );
    }
}
</script>

<style>
    #text-article {
        padding: 0 0 0 20px;
    }
</style>
