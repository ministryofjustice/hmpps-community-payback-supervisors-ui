/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ContactOutcomeDto = {
    /**
     * Contact outcome identifier
     */
    id: string;
    /**
     * Contact outcome name
     */
    name: string;
    /**
     * Contact outcome code
     */
    code: string;
    /**
     * If this outcome requires an enforcement action to take place
     */
    enforceable: boolean;
    /**
     * If this outcome represents attendance, and as such attendance information is required
     */
    attended: boolean;
    /**
     * If this outcome can be used by a supervisor
     */
    availableToSupervisors: boolean;
};

