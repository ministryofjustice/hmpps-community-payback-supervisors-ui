/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AppointmentSummaryDto } from './AppointmentSummaryDto';
import type { LocationDto } from './LocationDto';
export type SessionDto = {
    appointmentSummaries: Array<AppointmentSummaryDto>;
    date: string;
    location: LocationDto;
    projectCode: string;
    /**
     * Deprecated, use the structured location instead
     * @deprecated
     */
    projectLocation?: string | null;
    projectName: string;
};

