/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type AttendanceDataDto = {
    behaviour: 'EXCELLENT' | 'GOOD' | 'NOT_APPLICABLE' | 'POOR' | 'SATISFACTORY' | 'UNSATISFACTORY';
    /**
     * This property is no longer used as this is derived from the outcome.
     * @deprecated
     */
    hiVisWorn?: boolean | null;
    penaltyMinutes?: number | null;
    /**
     * Deprecated, use penaltyMinutes instead
     * @deprecated
     */
    penaltyTime?: string | null;
    workQuality: 'EXCELLENT' | 'GOOD' | 'NOT_APPLICABLE' | 'POOR' | 'SATISFACTORY' | 'UNSATISFACTORY';
    /**
     * This property is no longer used as this is derived from the outcome.
     * @deprecated
     */
    workedIntensively?: boolean | null;
};

