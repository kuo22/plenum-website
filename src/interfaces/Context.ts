export default class Context {
    public institution: string;
    public instructor: string[];
    public courseTitle: string;
    public courseCode?: string;
    public assistant?: string;

    constructor(institution: string, instructor: string[], courseTitle: string,
                courseCode?: string, assistant?: string) {
        this.institution = institution;
        this.instructor = instructor;
        this.courseTitle = courseTitle;
        this.courseCode = courseCode;
        this.assistant = assistant;
    }
}
