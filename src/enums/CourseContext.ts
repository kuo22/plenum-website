import Context from '@/interfaces/Context';
import {School} from '@/enums/School.ts';

export default class CourseContexts {
    private readonly _AA: Context;
    private readonly _UW_DXARTS_200: Context;
    private readonly _UW_DXARTS_470: Context;
    private readonly  _UW_GEOG_315: Context;
    private readonly _UW_GEOG_360: Context;
    private readonly _SYR_MEDHAB: Context;
    private readonly _SYR_ARCH_107: Context;
    private readonly _SYR_ARCH_108: Context;

    constructor() {
        this._AA = new Context(
            School.AA,
            ['Maria Fedorchenko'],
            'Shadow Cities and Cultural Processors',
            'Intermediate 7',
        );

        this._UW_DXARTS_200 = new Context(
            School.UW,
            ['Afroditi Psarra', 'Tivon Rice'],
            'Digital Art and New Media: History, Theory, and Practice',
            'DXARTS 200',
            'Sangjun Yoo',
        );

        this._UW_DXARTS_470 = new Context(
            School.UW,
            ['Haein Kang'],
            'Sensing and Control Systems for Digital Arts',
            'DXARTS 470',
        );

        this._UW_GEOG_315 = new Context(
            School.UW,
            ['Austin Crane'],
            'Explanation and Understanding in Geography',
            'GEOG 315',
        );

        this._UW_GEOG_360 = new Context(
            School.UW,
            ['Luke Bergmann'],
            'GIS and Mapping',
            'GEOG 360',
        );

        this._SYR_MEDHAB = new Context(
            School.SYR,
            ['Anne Beffel'],
            'Meditation Habitat',
        );

        this._SYR_ARCH_107 = new Context(
            School.SYR,
            ['Julie Larsen'],
            'Architectural Design I',
            'ARC 107',
        );

        this._SYR_ARCH_108 = new Context(
            School.SYR,
            ['Yutaka Sho'],
            'Architectural Design II',
            'ARC 108',
        );
    }

    get SYR_ARCH_108(): Context {
        return this._SYR_ARCH_108;
    }
    get SYR_ARCH_107(): Context {
        return this._SYR_ARCH_107;
    }
    get SYR_MEDHAB(): Context {
        return this._SYR_MEDHAB;
    }
    get UW_GEOG_360(): Context {
        return this._UW_GEOG_360;
    }
    get UW_GEOG_315(): Context {
        return this._UW_GEOG_315;
    }
    get UW_DXARTS_470(): Context {
        return this._UW_DXARTS_470;
    }
    get UW_DXARTS_200(): Context {
        return this._UW_DXARTS_200;
    }

    get AA(): Context {
        return this._AA;
    }
}
