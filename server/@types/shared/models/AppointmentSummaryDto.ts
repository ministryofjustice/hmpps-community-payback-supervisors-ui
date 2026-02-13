/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContactOutcomeDto } from './ContactOutcomeDto';
import type { OffenderFullDto } from './OffenderFullDto';
import type { OffenderLimitedDto } from './OffenderLimitedDto';
import type { OffenderNotFoundDto } from './OffenderNotFoundDto';
export type AppointmentSummaryDto = {
    id: number;
    /**
     * How many community payback minutes the offender is required to complete
     */
    contactOutcome?: ContactOutcomeDto;
    /**
     * Total minutes ordered. >= 0
     */
    requirementMinutes: number;
    /**
     * Adjustment minutes. Can positive or negative e.g. +50 means an additional 50 minutes have been added to the requirement
     */
    adjustmentMinutes: number;
    /**
     * How many community payback minutes the offender has completed to date. >= 0
     */
    completedMinutes: number;
    offender: (OffenderFullDto | OffenderLimitedDto | OffenderNotFoundDto);
    date?: string;
    startTime?: string;
    endTime?: string;
    daysOverdue?: number;
};

