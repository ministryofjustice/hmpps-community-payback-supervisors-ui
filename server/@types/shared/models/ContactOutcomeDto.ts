/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type ContactOutcomeDto = {
    /**
     * If this outcome represents attendance, and as such attendance information is required
     */
    attended: boolean;
    /**
     * Contact outcome code
     */
    code: string;
    /**
     * If this outcome requires an enforcement action to take place
     */
    enforceable: boolean;
    /**
     * Hint text to be displayed to the user
     */
    hintText?: string | null;
    /**
     * Contact outcome identifier
     */
    id: string;
    /**
     * Contact outcome name
     */
    name: string;
    willAlertEnforcementDiary: boolean;
};

