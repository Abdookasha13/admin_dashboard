import { Ilesson } from './ilesson';

export interface IlesonResponse {
  success: boolean;
  count: number;
  data: Ilesson[];
}
