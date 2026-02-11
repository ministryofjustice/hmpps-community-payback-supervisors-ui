/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AttendanceDataDto } from './AttendanceDataDto';
import type { EnforcementDto } from './EnforcementDto';
import type { OffenderFullDto } from './OffenderFullDto';
import type { OffenderLimitedDto } from './OffenderLimitedDto';
import type { OffenderNotFoundDto } from './OffenderNotFoundDto';
import type { PickUpDataDto } from './PickUpDataDto';
import type { ProjectTypeDto } from './ProjectTypeDto';
export type AppointmentDto = {
    id: number;
    communityPaybackId?: string;
    version: string;
    deliusEventNumber: number;
    /**
     * Retrieve project information from GET project instead. Whilst marked as optional to support deprecation, this will always be populated.
     * @deprecated
     */
    projectName?: string;
    projectCode: string;
    /**
     * Retrieve project information from GET project instead. Whilst marked as optional to support deprecation, this will always be populated.
     * @deprecated
     */
    projectTypeName?: string;
    /**
     * Retrieve project information from GET project instead. Whilst marked as optional to support deprecation, this will always be populated.
     * @deprecated
     */
    projectTypeCode?: string;
    /**
     * Retrieve project information from GET project instead. Whilst marked as optional to support deprecation, this will always be populated.
     * @deprecated
     */
    projectType?: ProjectTypeDto;
    offender: (OffenderFullDto | OffenderLimitedDto | OffenderNotFoundDto);
    supervisingTeam: string;
    supervisingTeamCode: string;
    providerCode: string;
    pickUpData?: PickUpDataDto;
    date: string;
    startTime: string;
    endTime: string;
    contactOutcomeCode?: string;
    attendanceData?: AttendanceDataDto;
    enforcementData?: EnforcementDto;
    supervisorOfficerCode: string;
    notes?: string;
    sensitive?: boolean;
    alertActive?: boolean;
};

