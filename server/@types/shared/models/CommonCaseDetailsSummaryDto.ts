/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CommonUnpaidWorkDetailsDto } from './CommonUnpaidWorkDetailsDto';
import type { OffenderFullDto } from './OffenderFullDto';
import type { OffenderLimitedDto } from './OffenderLimitedDto';
import type { OffenderNotFoundDto } from './OffenderNotFoundDto';
export type CommonCaseDetailsSummaryDto = {
    offender: (OffenderFullDto | OffenderLimitedDto | OffenderNotFoundDto);
    unpaidWorkDetails: Array<CommonUnpaidWorkDetailsDto>;
};

