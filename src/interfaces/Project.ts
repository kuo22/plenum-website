import Context from '@/interfaces/Context';

export default class Project {
    public title: string;
    public pathName: string;
    public year: number;
    public month: number;
    public filterCategories: string[];
    public url: string;

    public collaborators?: string[];
    public series?: string;

    public institution?: string;
    public instructor?: string[];
    public assistant?: string;
    public courseTitle?: string;
    public courseCode?: string;

    constructor(title: string, nickname: string, year: number, month: number, categories: string[],
                context?: Context, collaborators?: string[], series?: string) {
        this.title = title;
        this.pathName = nickname;
        this.year = year;
        this.month = month;
        this.filterCategories = categories;
        this.collaborators = collaborators;
        this.url = title.replace(/\s/g, '');
        this.series = series;

        if (context) {
            this.institution = context.institution;
            this.instructor = context.instructor;
            this.assistant = context.assistant;
            this.courseTitle = context.courseTitle;
            this.courseCode = context.courseCode;
        }
    }
}
