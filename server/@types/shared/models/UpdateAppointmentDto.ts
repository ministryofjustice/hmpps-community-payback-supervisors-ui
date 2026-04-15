/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AttendanceDataDto } from './AttendanceDataDto';
export type UpdateAppointmentDto = {
    /**
     * Delius ID of the appointment to update
     */
    deliusId: number;
    /**
     * The version of the appointment retrieved from delius this update is being applied to
     */
    deliusVersionToUpdate: string;
    date: string;
    /**
     * The start local time of the appointment
     */
    startTime: string;
    /**
     * The end local time of the appointment
     */
    endTime: string;
    contactOutcomeCode?: string;
    attendanceData?: AttendanceDataDto;
    supervisorOfficerCode: string;
    notes?: string;
    alertActive?: boolean;
    /**
     * If the corresponding delius contact should be marked as sensitive
     */
    sensitive?: boolean;
};

