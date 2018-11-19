 
export type S = [number,number,number]
export interface Thing {
  s: S;
  ds: S;
  dds: S;
  m: number;
  r: number;
}

export const simulate = (ts: Thing[]):Thing[] => ts.map(simulateThing)

const simulateThing: (b: Thing, i: number, bodies: Thing[]) => Thing = (
  b,
  i,
  bs
) => {
  const unitb = { ...b, m: 1 }; // pretend b is of unit mass so we don't have to divide through by mass
  const dds: S = bs
    .map((b2,j) => {
      if (i===j){
        return zero
      }
      return force(unitb, b2)
    })
    .reduce(add, zero);
  const ds: S = add(b.dds, b.ds);
  const s: S = add(b.s, b.ds);
  return { s, ds, dds, m: b.m, r: b.r };
};

const zero:S = [0,0,0]
const G = -1e-3

export const apply = (f: (x: number, y: number) => number) => (s1: S, s2: S):S => [f(s1[0],s2[0]),f(s1[1],s2[1]),f(s1[2],s2[2])]
export const applyScalar = (f: (x: number) => number) => (s: S):S => [f(s[0]),f(s[1]),f(s[2])]

export const add = apply((x,y)=>x+y)
export const sub = apply((x,y)=>x-y)
const magnitudeSquared= (s:S):number  => s.map(x => x**2).reduce((x,y)=>x+y) 


const force = (t1:Thing,t2:Thing):S =>{
  const d = sub(t1.s,t2.s)
  const r2 = magnitudeSquared(d)
  const r = r2 ** 0.5
  if (r < (t1.r + t2.r)) {
    return zero // there's been a collision so lets just not model this
  }
  const u = applyScalar(x=>x/r)(d)
  // const usize = magnitudeSquared(u)
  const c = G * t1.m * t2.m / r2
  return applyScalar(_=>_ * c)(u)  
}

export const putInOrbit = (star: Thing, planet: Thing):Thing => {
  const r = sub(planet.s,star.s)
  const r_ = magnitudeSquared(r) ** 0.5
  const s:S = [star.s[0] - r_, star.s[1],star.s[2]]
  // At this point we know that the gravitational force
  // Is in direction +x, so a perpendicular force would be in y or z
  const v = ((Math.abs(G * star.m / r_)))**0.5
  const ds:S = [0,v,0]
 
  return ({
    ...planet,
    s,
    ds,
    dds:zero
  })
}

export const scaleMassesForHSL : (ts: Thing[]) => (x: number) => number = (ts: Thing[]) => (x: number) => {
  const masses = ts.map(_ => _.m)
  const min = Math.min(...masses)
  const max = Math.max(...masses)
  const scale = 320/(max-min)
  return ((x- min) * scale)+40
}