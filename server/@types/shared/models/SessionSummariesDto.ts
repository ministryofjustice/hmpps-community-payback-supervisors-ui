/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PageMetaDto } from './PageMetaDto';
import type { SessionSummaryDto } from './SessionSummaryDto';
export type SessionSummariesDto = {
    /**
     *
     * Deprecated: use the `content` property instead.
     *
     * List of project allocations
     *
     * @deprecated
     */
    allocations: Array<SessionSummaryDto>;
    content: Array<SessionSummaryDto>;
    page: PageMetaDto;
};

