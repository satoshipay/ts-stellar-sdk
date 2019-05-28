import { xdr, int64 } from "ts-stellar-xdr";

export interface SimpleTimeBounds {
  minTime?: Date | number;
  maxTime?: Date | number;
}

function createTimeBound(timeBound: Date | number | undefined): int64.Unsigned {
  if (typeof timeBound === "number" && (isNaN(timeBound) || !isFinite(timeBound))) {
    throw new Error("Timebound must a finite integer");
  }

  const timeBoundNumber = timeBound ? (typeof timeBound === "number" ? timeBound : timeBound.getTime() / 1000) : 0;
  return int64.Unsigned.fromNumber(timeBoundNumber);
}

export function createTimeBounds({ minTime, maxTime }: SimpleTimeBounds): xdr.TimeBounds {
  return {
    minTime: createTimeBound(minTime),
    maxTime: createTimeBound(maxTime)
  };
}

export function simplifyTimeBounds(timeBounds: xdr.TimeBounds): SimpleTimeBounds {
  const minTime = timeBounds.minTime.toNumber();
  const maxTime = timeBounds.minTime.toNumber();

  return {
    ...(minTime === 0 ? null : { minTime: new Date(minTime * 1000) }),
    ...(maxTime === 0 ? null : { maxTime: new Date(maxTime * 1000) })
  };
}
