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

export function create({ minTime, maxTime }: SimpleTimeBounds): xdr.TimeBounds {
  return {
    minTime: createTimeBound(minTime),
    maxTime: createTimeBound(maxTime)
  };
}

export function simplify(timeBounds: xdr.TimeBounds): SimpleTimeBounds {
  const minTime = timeBounds.minTime.toNumber();
  const maxTime = timeBounds.minTime.toNumber();

  return {
    minTime: minTime === 0 ? undefined : new Date(minTime * 1000),
    maxTime: maxTime === 0 ? undefined : new Date(maxTime * 1000)
  };
}
