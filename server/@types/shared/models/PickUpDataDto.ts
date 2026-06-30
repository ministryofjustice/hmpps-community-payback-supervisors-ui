/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LocationDto } from './LocationDto';
import type { PickUpLocationDto } from './PickUpLocationDto';
export type PickUpDataDto = {
    location?: (LocationDto | null);
    /**
     * Use pickupLocation.deliusCode instead
     * @deprecated
     */
    locationCode?: string | null;
    /**
     * Use pickupLocation.description instead
     * @deprecated
     */
    locationDescription?: string | null;
    pickupLocation?: (PickUpLocationDto | null);
    time?: string | null;
};

