/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LocationDto } from './LocationDto';
import type { PickUpLocationDto } from './PickUpLocationDto';
export type PickUpDataDto = {
    /**
     * Use pickupLocation instead
     * @deprecated
     */
    location?: LocationDto;
    /**
     * Use pickupLocation.deliusCode instead
     * @deprecated
     */
    locationCode?: string;
    /**
     * Use pickupLocation.description instead
     * @deprecated
     */
    locationDescription?: string;
    pickupLocation?: PickUpLocationDto;
    time?: string;
};

