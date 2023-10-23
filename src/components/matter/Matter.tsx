'use client';
import React, { useEffect, useRef, useState } from 'react';
import s from './Matter.module.css';
import ReactDOM from 'react-dom';
import Matter, { Bodies, Composite, Svg, Vertices, World } from 'matter-js';

import LetterF from '../../assets/svgs/f.svg';

export const MatterWrapper = () => {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const letters = [LetterF];

  const SVG_PATH_SELECTOR = '#matter-path';
  const SVG_WIDTH_IN_PX = 100;
  const SVG_WIDTH_AS_PERCENT_OF_CONTAINER_WIDTH = 0.3;

  const matterSetup = () => {
    if (!sceneRef.current) return;
    var Engine = Matter.Engine,
      Render = Matter.Render,
      World = Matter.World,
      Bodies = Matter.Bodies,
      Mouse = Matter.Mouse,
      MouseConstraint = Matter.MouseConstraint,
      Body = Matter.Body,
      Svg = Matter.Svg,
      Vector = Matter.Vector,
      Vertices = Matter.Vertices;

    var engine = Engine.create({
      // positionIterations: 20
    });

    var render = Render.create({
      element: sceneRef.current,
      engine: engine,
      options: {
        width: windowWidth,
        height: windowHeight,
        wireframes: false,
      },
    });

    var ballA = Bodies.circle(210, 100, 30, { restitution: 0.5 });
    var ballB = Bodies.circle(110, 50, 30, { restitution: 0.5 });
    World.add(engine.world, [
      // walls
      Bodies.rectangle(windowWidth / 2, windowHeight + 30, windowWidth, 60, {
        isStatic: true,
        label: 'Ground',
      }),
      Bodies.rectangle(-30, windowHeight / 2, 60, windowHeight, {
        isStatic: true,
        label: 'Wall Left',
      }),
      Bodies.rectangle(windowWidth + 30, windowHeight / 2, 60, windowHeight, {
        isStatic: true,
        label: 'Wall Right',
      }),
    ]);

    const createSvgBodies = () => {
      const paths = document.querySelectorAll(SVG_PATH_SELECTOR);
      console.log(paths);
      letters.forEach((path, index) => {
        console.log(path);
        let vertices = Svg.pathToVertices(path as SVGPathElement, 0);
        let scaleFactor =
          (windowWidth * SVG_WIDTH_AS_PERCENT_OF_CONTAINER_WIDTH) /
          SVG_WIDTH_IN_PX;
        vertices = Vertices.scale(vertices, scaleFactor, scaleFactor);
        let svgBody = Bodies.fromVertices(index * SVG_WIDTH_IN_PX + 200, 0, [
          vertices,
        ]);
        World.add(engine.world, svgBody);
      });
    };

    createSvgBodies();

    // add mouse control
    var mouse = Mouse.create(render.canvas),
      mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false,
          },
        },
      });

    World.add(engine.world, mouseConstraint);

    Matter.Events.on(mouseConstraint, 'mousedown', function (event) {
      World.add(engine.world, Bodies.circle(150, 50, 30, { restitution: 0.7 }));
    });

    Engine.run(engine);

    Render.run(render);
  };

  useEffect(() => {
    window.addEventListener('resize', () => {
      setWindowHeight(window.innerHeight);
      setWindowWidth(window.innerWidth);
    });
    matterSetup();
  }, []);

  return <div ref={sceneRef}></div>;
};
