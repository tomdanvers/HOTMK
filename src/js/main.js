Array.prototype.random = function() {

    return this[Math.floor(Math.random() * this.length)];

}

if (window.location.hostname === 'localhost') {

    startGame();

} else {

    document.addEventListener('deviceready', startGame, false);

}

import PIXI from 'pixi.js';
import raf from 'raf';
import World from './World';
import Layout from './Layout';

function startGame() {

    if (window && window.screen) {

        Layout.WIDTH = Math.min(960, window.screen.width);
        Layout.HEIGHT = Math.min(640, window.screen.height);

    }

    let renderer = PIXI.autoDetectRenderer(Layout.WIDTH, Layout.HEIGHT, {backgroundColour: 0x000000});
    document.body.appendChild(renderer.view);

    let stage = new PIXI.Container();

    let world = new World();
    stage.addChild(world);

    let count = 0;
    let msPerFrame = 1000/60;

    tick(0);

    function tick(time) {

        if (document.hasFocus()) {

            count ++;

            if (count % 2 === 0) {

                world.update(count * msPerFrame);

                renderer.render(stage);

            }

        }

        raf(tick);

    }

}
