/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AttendanceDataDto } from './AttendanceDataDto';
export type UpdateAppointmentDto = {
    alertActive?: boolean | null;
    attendanceData?: (AttendanceDataDto | null);
    contactOutcomeCode?: string | null;
    date: string;
    /**
     * Delius ID of the appointment to update
     */
    deliusId: number;
    /**
     * The version of the appointment retrieved from delius this update is being applied to
     */
    deliusVersionToUpdate: string;
    /**
     * The end local time of the appointment
     */
    endTime: string;
    notes?: string | null;
    projectCode?: string | null;
    /**
     * If the corresponding delius contact should be marked as sensitive
     */
    sensitive?: boolean | null;
    /**
     * The start local time of the appointment
     */
    startTime: string;
    supervisorOfficerCode: string;
    supervisorTeamCode?: string | null;
};

