/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type SessionSummaryDto = {
    /**
     * Project name
     */
    projectName: string;
    /**
     * Project code
     */
    projectCode: string;
    /**
     * Allocation date
     */
    date: string;
    /**
     * Allocation start local time (deprecated)
     * @deprecated
     */
    startTime: string;
    /**
     * Allocation end local time (deprecated)
     * @deprecated
     */
    endTime: string;
    /**
     * Number of offenders allocated
     */
    numberOfOffendersAllocated: number;
    /**
     * Number of offenders with outcomes
     */
    numberOfOffendersWithOutcomes: number;
    /**
     * Number of offenders with outcomes requiring enforcement
     */
    numberOfOffendersWithEA: number;
};

