/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AttendanceDataDto = {
    hiVisWorn: boolean;
    workedIntensively: boolean;
    /**
     * Deprecated, use penaltyMinutes instead
     * @deprecated
     */
    penaltyTime?: string;
    penaltyMinutes?: number;
    workQuality: 'EXCELLENT' | 'GOOD' | 'NOT_APPLICABLE' | 'POOR' | 'SATISFACTORY' | 'UNSATISFACTORY';
    behaviour: 'EXCELLENT' | 'GOOD' | 'NOT_APPLICABLE' | 'POOR' | 'SATISFACTORY' | 'UNSATISFACTORY';
};

