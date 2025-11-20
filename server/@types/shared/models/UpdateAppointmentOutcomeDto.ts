/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AttendanceDataDto } from './AttendanceDataDto';
import type { EnforcementDto } from './EnforcementDto';
import type { FormKeyDto } from './FormKeyDto';
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
    /**
     * If provided, the corresponding form data will be deleted
     */
    formKeyToDelete?: FormKeyDto;
    /**
     * If the corresponding delius contact should be alerted
     */
    alertActive?: boolean;
    /**
     * If the corresponding delius contact should be marked as sensitive
     */
    sensitive?: boolean;
};

