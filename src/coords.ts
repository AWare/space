import { S, add, applyScalar } from './space';

export const translate = (s:S, t:S, f: number ):S => {
  return add(applyScalar(_=>_*f)(s),t)
}  