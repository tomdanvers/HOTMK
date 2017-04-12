Array.prototype.random = function() {

    return this[Math.floor(Math.random() * this.length)];

}


import * as PIXI from 'pixi.js';
import raf from 'raf';
import World from './World';
import Layout from './Layout';

World.DEBUG = window.location.hostname !== "";

if (World.DEBUG) {

    // World.DEBUG = false;
    startGame();

} else {

    document.addEventListener('deviceready', startGame, false);

}

function startGame() {

    if (window && window.screen) {


        Layout.WIDTH = Math.min(Layout.WIDTH, window.screen.width);
        Layout.HEIGHT = Math.min(Layout.HEIGHT, window.screen.height);

        console.log(window.screen);
        console.log(Layout.WIDTH, Layout.HEIGHT);

    }

    let renderer = PIXI.autoDetectRenderer(Layout.WIDTH, Layout.HEIGHT, {backgroundColour: 0x000000});
    document.body.appendChild(renderer.view);

    let stage = new PIXI.Container();

    let world = new World();
    stage.addChild(world);

    let frame = 0;
    let count = 0;
    let msPerFrame = 1000/60;

    tick(0);

    function tick(time) {

        if (document.hasFocus() || World.DEBUG) {

            frame ++;

            count += World.TICK_RATE;

            if (frame % 2 === 0) {

                world.update(count * msPerFrame);

                renderer.render(stage);

            }

        }

        raf(tick);

    }

}
