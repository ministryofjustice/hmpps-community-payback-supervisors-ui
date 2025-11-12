export interface BaseRequest {
  username: string
}

export interface GetSessionRequest extends BaseRequest {
  projectCode: string
  date: string
}
