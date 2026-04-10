/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AttendanceDataDto } from './AttendanceDataDto';
import type { EnforcementDto } from './EnforcementDto';
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
    date?: string;
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
    /**
     * Setting specific enforcement data is not supported
     * @deprecated
     */
    enforcementData?: EnforcementDto;
    supervisorOfficerCode: string;
    notes?: string;
    alertActive?: boolean;
    /**
     * If the corresponding delius contact should be marked as sensitive
     */
    sensitive?: boolean;
};

