/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiResponseIssue } from './ApiResponseIssue';
export type ErrorResponse = {
    content?: any;
    /**
     * Included for backwards compatibility. Use 'errors' instead.
     * @deprecated
     */
    developerMessage?: string | null;
    errors: Array<ApiResponseIssue>;
    hasContent: boolean;
    hasErrors: boolean;
    hasWarnings: boolean;
    status: number;
    success: boolean;
    /**
     * Included for backwards compatibility. Use 'errors' instead.
     * @deprecated
     */
    userMessage?: string | null;
    warnings: Array<ApiResponseIssue>;
};

