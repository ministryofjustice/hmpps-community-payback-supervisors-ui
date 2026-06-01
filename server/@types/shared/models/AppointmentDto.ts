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
    /**
     * The NDelius Appointment ID
     */
    id: number;
    communityPaybackId?: string | null;
    version: string;
    deliusEventNumber: number;
    /**
     * Retrieve project information from GET project instead. Whilst marked as optional to support deprecation, this will always be populated.
     * @deprecated
     */
    projectName?: string | null;
    projectCode: string;
    /**
     * Retrieve project information from GET project instead. Whilst marked as optional to support deprecation, this will always be populated.
     * @deprecated
     */
    projectTypeName?: string | null;
    /**
     * Retrieve project information from GET project instead. Whilst marked as optional to support deprecation, this will always be populated.
     * @deprecated
     */
    projectTypeCode?: string | null;
    projectType?: (ProjectTypeDto | null);
    offender: (OffenderFullDto | OffenderLimitedDto | OffenderNotFoundDto);
    supervisingTeam: string;
    supervisingTeamCode: string;
    providerCode: string;
    pickUpData?: (PickUpDataDto | null);
    date: string;
    startTime: string;
    endTime: string;
    minutesCredited?: number | null;
    contactOutcomeCode?: string | null;
    attendanceData?: (AttendanceDataDto | null);
    enforcementData?: (EnforcementDto | null);
    supervisorOfficerName: string;
    supervisorOfficerCode: string;
    notes?: string | null;
    sensitive?: boolean | null;
    alertActive?: boolean | null;
};

