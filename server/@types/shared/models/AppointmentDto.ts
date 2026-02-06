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
export type AppointmentDto = {
    id: number;
    communityPaybackId?: string;
    version: string;
    deliusEventNumber: number;
    projectName: string;
    projectCode: string;
    projectTypeName: string;
    projectTypeCode: string;
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

