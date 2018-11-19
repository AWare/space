import * as React from "react";
import "./App.css";
import { Thing, simulate, scaleMassesForHSL, putInOrbit } from "./space";
import { translate } from './coords';

export class App extends React.Component {
  public render() {
    return (
      <div className="outer">
        <canvas id="space" width="1px" height="1px" />
      </div>
    );
  }

  public componentDidMount() {
    const canvas = document.getElementById("space") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");
    if (ctx == null || document.documentElement == null) {
      throw new Error("this is careless alex");
    }
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
    const star: Thing = {
      s: [700, 600, 0],
      ds: [0, 0, 0],
      dds: [0, 0, 0],
      m: 1e8,
      r: 20
    };
    const planet: Thing = {
      s: [450, 200, 10],
      ds: [0, 31.6, 0],
      dds: [0, 0, 0],
      m: 1000,
      r: 5
    };
    const planet2: Thing = {
      s: [460, 700, 30],
      ds: [0, 31.6, 0],
      dds: [0, 0, 0],
      m: 10000,
      r: 5
    };
    const planet3: Thing = putInOrbit(star, {
      s: [460, 100, 300],
      ds: [0, 31.6, 0],
      dds: [0, 0, 0],
      m: 10000,
      r: 5
    });
    const planet4: Thing = {
      s: [1000, 0, 20],
      ds: [0, 0, 0],
      dds: [0, 0, 0],
      m: 1000000,
      r: 7
    };
    
    let things: Thing[] = [putInOrbit(star,planet4), star,putInOrbit(star,planet) , putInOrbit(star, planet2),planet3];
    
    const scale = scaleMassesForHSL(things)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      things = simulate(things);

      things.forEach(thing => {
        const coords = translate(thing.s,[canvas.width/2,canvas.height/2,0],0.1)
        const h = scale(thing.m)
        const v = Math.min(95,Math.max(0,(((thing.s[2] / canvas.width) + 1) * (95/2)))) + 5
        console.log(v)
        ctx.fillStyle = `hsl(${h} 100% ${v}%)`;
        ctx.beginPath();
        ctx.ellipse(
          coords[0],
          coords[1],
          thing.r,
          thing.r,
          0,
          0,
          Math.PI * 2
        );
        ctx.fill();
      });
      requestAnimationFrame(animate);
    };
    animate();
  }
}
