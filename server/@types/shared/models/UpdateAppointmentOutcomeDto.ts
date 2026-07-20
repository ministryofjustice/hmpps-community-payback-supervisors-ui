/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AttendanceDataDto } from './AttendanceDataDto';
export type UpdateAppointmentOutcomeDto = {
    /**
     * Delius ID of the appointment to update
     */
    deliusId: number;
    /**
     * The version of the appointment retrieved from delius this update is being applied to
     */
    deliusVersionToUpdate: string;
    /**
     * If not defined the date will not be modified. Optionality on this field will be removed in the future
     */
    date?: string | null;
    /**
     * The start local time of the appointment
     */
    startTime: string;
    /**
     * The end local time of the appointment
     */
    endTime: string;
    contactOutcomeCode?: string | null;
    attendanceData?: (AttendanceDataDto | null);
    supervisorOfficerCode: string;
    supervisorTeamCode?: string | null;
    projectCode?: string | null;
    notes?: string | null;
    alertActive?: boolean | null;
    /**
     * If the corresponding delius contact should be marked as sensitive
     */
    sensitive?: boolean | null;
};

