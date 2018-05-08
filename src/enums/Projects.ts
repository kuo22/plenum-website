import Project from '@/interfaces/Project';
import CourseContext from '@/enums/CourseContext';
import Context from '@/interfaces/Context';

export class Projects {
    private readonly _WHITEVOIDFILL: Project;
    private readonly _CACHE: Project;
    private readonly _AEOLUS: Project;
    private readonly _LEFRESNOY: Project;
    private readonly _HOMEFORSALES: Project;

    constructor() {
        // let contexts = new Contexts();
        const courseContexts = new CourseContext();

        this._WHITEVOIDFILL = new Project(
            'whitevoidfill',
            'void',
            2016,
            12,
            ['art'],
            courseContexts.UW_DXARTS_200,
        );

        this._CACHE = new Project(
            'cache',
            'cache',
            2016,
            4,
            ['art'],
            new Context('', [''], '', ''),
            [
                'Alex Boechenstein',
                'Max Cleary',
            ],
            'CACHÉ',
        );

        this._AEOLUS = new Project(
            'aeolus',
            'aeolus',
            2013,
            5,
            ['architecture'],
            new Context('', [''], '', ''),
            [
                'Monica Beatriz',
            ],
        );

        this._LEFRESNOY = new Project(
            'le fresnoy 2.0',
            'fresnoy',
            2014,
            11,
            ['architecture'],
        );

        this._HOMEFORSALES = new Project(
            'home for sale(s)',
            'home',
            2015,
            5,
            ['art', 'architecture'],
        );
    }

    get allProjects(): Project[] {
        return [
            this.HOMEFORSALES,
            this.LEFRESNOY,
            this.AEOLUS,
            this.CACHE,
            this.WHITEVOIDFILL,
        ];
    }

    get HOMEFORSALES(): Project {
        return this._HOMEFORSALES;
    }
    get LEFRESNOY(): Project {
        return this._LEFRESNOY;
    }
    get AEOLUS(): Project {
        return this._AEOLUS;
    }
    get CACHE(): Project {
        return this._CACHE;
    }
    get WHITEVOIDFILL(): Project {
        return this._WHITEVOIDFILL;
    }
}
