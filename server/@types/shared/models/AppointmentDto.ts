/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdjustmentDto } from './AdjustmentDto';
import type { AttendanceDataDto } from './AttendanceDataDto';
import type { EnforcementDto } from './EnforcementDto';
import type { OffenderFullDto } from './OffenderFullDto';
import type { OffenderLimitedDto } from './OffenderLimitedDto';
import type { OffenderNotFoundDto } from './OffenderNotFoundDto';
import type { PickUpDataDto } from './PickUpDataDto';
import type { ProjectTypeDto } from './ProjectTypeDto';
export type AppointmentDto = {
    adjustments: Array<AdjustmentDto>;
    alertActive?: boolean | null;
    attendanceData?: (AttendanceDataDto | null);
    communityPaybackId?: string | null;
    contactOutcomeCode?: string | null;
    date: string;
    deliusEventNumber: number;
    endTime: string;
    enforcementData?: (EnforcementDto | null);
    /**
     * The NDelius Appointment ID
     */
    id: number;
    minutesCredited?: number | null;
    notes?: string | null;
    offender: (OffenderFullDto | OffenderLimitedDto | OffenderNotFoundDto);
    pickUpData?: (PickUpDataDto | null);
    projectCode: string;
    /**
     * Retrieve project information from GET project instead. Whilst marked as optional to support deprecation, this will always be populated.
     * @deprecated
     */
    projectName?: string | null;
    /**
     * Retrieve project information from GET project instead. Whilst marked as optional to support deprecation, this will always be populated.
     * @deprecated
     */
    projectType?: (ProjectTypeDto | null);
    /**
     * Retrieve project information from GET project instead. Whilst marked as optional to support deprecation, this will always be populated.
     * @deprecated
     */
    projectTypeCode?: string | null;
    /**
     * Retrieve project information from GET project instead. Whilst marked as optional to support deprecation, this will always be populated.
     * @deprecated
     */
    projectTypeName?: string | null;
    providerCode: string;
    sensitive?: boolean | null;
    startTime: string;
    supervisingTeam: string;
    supervisingTeamCode: string;
    supervisorOfficerCode: string;
    supervisorOfficerName: string;
    version: string;
};

