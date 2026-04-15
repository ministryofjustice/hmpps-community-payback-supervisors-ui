/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AppointmentSummaryDto } from './AppointmentSummaryDto';
import type { LocationDto } from './LocationDto';
export type SessionDto = {
    projectName: string;
    projectCode: string;
    /**
     * Deprecated, use the structured location instead
     * @deprecated
     */
    projectLocation?: string;
    location: LocationDto;
    date: string;
    appointmentSummaries: Array<AppointmentSummaryDto>;
};

