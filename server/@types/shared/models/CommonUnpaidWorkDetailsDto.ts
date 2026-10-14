/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CourtDto } from './CourtDto';
import type { MainOffenceDto } from './MainOffenceDto';
export type CommonUnpaidWorkDetailsDto = {
    eventNumber: number;
    sentenceDate: string;
    requiredMinutes: number;
    /**
     * Minutes completed through attended appointments, before adjustments
     */
    attendedAppointmentsMinutes: number;
    /**
     * Total adjustment minutes; negative values reduce the requirement
     */
    totalAdjustmentMinutes: number;
    /**
     * Attended appointment minutes minus total adjustment minutes
     */
    completedMinutes: number;
    /**
     * Required minutes minus completed minutes
     */
    remainingMinutes: number;
    /**
     * The total number of minutes that can be credited to ETE appointments
     */
    allowedEteMinutes: number;
    /**
     * The total number of minutes credited to ETE appointments
     */
    completedEteMinutes: number;
    /**
     * The total number of remaining minutes that can be credited to ETE appointments
     */
    remainingEteMinutes: number;
    eventOutcome: string;
    upwStatus?: string | null;
    referralDate: string;
    convictionDate?: string | null;
    court?: (CourtDto | null);
    mainOffence: MainOffenceDto;
};

