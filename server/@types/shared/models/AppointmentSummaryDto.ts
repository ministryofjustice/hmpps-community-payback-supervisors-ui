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
    requirementMinutes: number;
    /**
     * How many community payback minutes the offender has completed to date
     */
    completedMinutes: number;
    offender: (OffenderFullDto | OffenderLimitedDto | OffenderNotFoundDto);
};

