/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CourtDto } from './CourtDto';
import type { MainOffenceDto } from './MainOffenceDto';
export type CommonUnpaidWorkDetailsDto = {
    /**
     * The total number of minutes that can be credited to ETE appointments
     */
    allowedEteMinutes: number;
    /**
     * Minutes completed through attended appointments, before adjustments
     */
    attendedAppointmentsMinutes: number;
    /**
     * The total number of minutes credited to ETE appointments
     */
    completedEteMinutes: number;
    /**
     * Attended appointment minutes minus total adjustment minutes
     */
    completedMinutes: number;
    convictionDate?: string | null;
    court?: (CourtDto | null);
    eventNumber: number;
    eventOutcome: string;
    mainOffence: MainOffenceDto;
    referralDate: string;
    /**
     * The total number of remaining minutes that can be credited to ETE appointments
     */
    remainingEteMinutes: number;
    /**
     * Required minutes minus completed minutes
     */
    remainingMinutes: number;
    requiredMinutes: number;
    sentenceDate: string;
    /**
     * Total adjustment minutes; negative values reduce the requirement
     */
    totalAdjustmentMinutes: number;
    upwStatus?: string | null;
};

