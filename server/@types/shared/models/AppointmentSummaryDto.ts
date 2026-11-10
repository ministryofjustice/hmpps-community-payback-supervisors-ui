/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdjustmentDto } from './AdjustmentDto';
import type { ContactOutcomeDto } from './ContactOutcomeDto';
import type { OffenderFullDto } from './OffenderFullDto';
import type { OffenderLimitedDto } from './OffenderLimitedDto';
import type { OffenderNotFoundDto } from './OffenderNotFoundDto';
export type AppointmentSummaryDto = {
    /**
     * Adjustment minutes. Can positive or negative e.g. +50 means an additional 50 minutes have been added to the requirement
     */
    adjustmentMinutes: number;
    adjustments: Array<AdjustmentDto>;
    /**
     * How many community payback minutes the offender has completed to date. >= 0
     */
    completedMinutes: number;
    /**
     * How many community payback minutes the offender is required to complete
     */
    contactOutcome?: (ContactOutcomeDto | null);
    date: string;
    daysOverdue?: number | null;
    endTime: string;
    /**
     * The NDelius Appointment ID
     */
    id: number;
    minutesCredited?: number | null;
    notes?: string | null;
    offender: (OffenderFullDto | OffenderLimitedDto | OffenderNotFoundDto);
    projectCode: string;
    projectName: string;
    projectTypeCode: string;
    projectTypeName: string;
    /**
     * Total minutes ordered. >= 0
     */
    requirementMinutes: number;
    startTime: string;
};

