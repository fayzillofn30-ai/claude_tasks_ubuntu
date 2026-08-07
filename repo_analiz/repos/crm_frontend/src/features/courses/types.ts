// src/features/courses/types.ts
export type CourseFlat =         {
            "id": string
            "name": string,
            "price": number,
            "published": boolean,
            "durationMont": number,
            "weekDays": number[],
            "durationMinut": number,
            "image": string,
            "isDeleted": boolean
        };
