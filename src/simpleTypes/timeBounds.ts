import { xdr, int64 } from "ts-stellar-xdr";

export interface SimpleTimeBounds {
  minTime?: Date | number;
  maxTime?: Date | number;
}

function createTimeBound(timeBound: Date | number | undefined) {
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
