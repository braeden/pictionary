import {
    hardWords
} from './words.js'

import * as Interface from './interfaces'
//@ts-ignore
const socket = io();

const strokeStyle = (value: number): string => `hsl(${value}, 100%, ${value % 360 === 0 ? (value / 360) * 100 : 50}%)`

class Surface {
    //@ts-ignore
    static c: HTMLCanvasElement = document.getElementById('drawing')
    static ctx: CanvasRenderingContext2D = Surface.c.getContext('2d')
    static dpi: number = window.devicePixelRatio || 1;

    static setup() {
        Surface.ctx.imageSmoothingEnabled = false
        Surface.c.height = Surface.c.clientHeight * Surface.dpi
        Surface.c.width = Surface.c.clientWidth * Surface.dpi
    }

    static resize() {
        Surface.setup()
        socket.emit('requestSync')
    }

}

Surface.setup();

class Draw {

    static previous = [];


    static pos: Interface.Point = {
        x: 0,
        y: 0
    }

    static enable = true;
    static lineWidth = 10 * Surface.dpi;
    static hue = 0;


    static draw(o: Interface.Drawing): void {
        if (o.clear) {
            Surface.ctx.clearRect(0, 0, Surface.c.width, Surface.c.height);
            Draw.previous = [];
        } else if (o.undo) {
            Draw.previous.splice(-5, 5)
            Draw.fromScratch(Draw.previous);
        } else {
            const scale = Surface.c.width / o.w
            Surface.ctx.beginPath();
            Surface.ctx.strokeStyle = strokeStyle(o.h)
            Surface.ctx.lineCap = 'round'
            if (o.p) {
                Surface.ctx.lineWidth = 1;
                Surface.ctx.fillStyle = strokeStyle(o.h);
                Surface.ctx.arc(o.up.x * scale, o.up.y * scale, o.l * scale / 2, 0, 2 * Math.PI);
            } else {
                Surface.ctx.lineWidth = o.l * scale
                Surface.ctx.moveTo(o.old.x * scale, o.old.y * scale);
                Surface.ctx.lineTo(o.up.x * scale, o.up.y * scale);
                Draw.previous.push(o);
            }
            Surface.ctx.stroke();
            Surface.ctx.fill();
        }
    }

    static fromScratch(array: Interface.Drawing[]): void {
        Draw.draw({
            clear: true
        });
        array.forEach((o: Interface.Drawing) => {
            Draw.draw(o)
        })
    }

    static disableForElement(e: HTMLElement): void {
        const dis = () => Draw.enable = false
        e.addEventListener('mousedown', dis)
        e.addEventListener('touchstart', dis)
    }

    static handleEvent(e: any): void {
        const touch = e.type == 'touchmove' || e.type == 'touchstart'
        const point = e.type == 'touchstart' || e.type == 'mousedown'
        if (!touch && e.buttons !== 1 || !Draw.enable) return;
        const old = {
            ...Draw.pos
        }
        touch ? Draw.setPositionTouch(e) : Draw.setPosition(e);
        const up = {
            ...Draw.pos
        }
        const o: Interface.Drawing = {
            l: Draw.lineWidth,
            h: Draw.hue,
            old,
            up,
            w: Surface.c.width,
            p: point
        }
        Draw.draw(o)
        socket.emit('draw', o)
    }

    static setPosition(e: any): void {
        Draw.pos.x = e.clientX * Surface.dpi;
        Draw.pos.y = e.clientY * Surface.dpi;
    }

    static setPositionTouch(e: any): void {
        Draw.pos.x = e.touches[0].pageX * Surface.dpi;
        Draw.pos.y = e.touches[0].pageY * Surface.dpi;
    }

    static sync(o: Interface.Drawing) {
        Draw.draw(o)
        socket.emit('draw', o)
    }

}

socket.emit('askRoom', window.location.pathname.split("/")[2] || '');
socket.on('givenRoom', (data: string) => {
    history.replaceState(null, '', `/g/${data}`)
})
socket.emit('requestSync')
socket.on('requestSync', (data: Interface.RequestSyncInput): void => {
    const output: Interface.RequestSyncOutput = {
        ...data,
        draws: Draw.previous
    }
    socket.emit('drawSync', output)
})
socket.on('drawSync', Draw.fromScratch);
socket.on('draw', Draw.draw);



(function setupListeners(): void {

    window.addEventListener('resize', Surface.resize);
    document.addEventListener('mousemove', Draw.handleEvent);
    document.addEventListener('mousedown', Draw.handleEvent);
    document.addEventListener('mouseenter', Draw.setPosition);
    document.addEventListener('mouseup', () => {
        Draw.enable = true
    })
    document.addEventListener('touchend', () => {
        Draw.enable = true
    })

    document.addEventListener('touchmove', Draw.handleEvent);
    document.addEventListener('touchstart', Draw.handleEvent);


    [...document.getElementsByTagName('input'), ...document.getElementsByTagName('button')].forEach(Draw.disableForElement);
    document.getElementById('color').addEventListener('input', (e: InputEvent) => {
        Draw.hue = parseInt((e.srcElement as HTMLInputElement).value);
        document.getElementById('colorExample').style.backgroundColor = strokeStyle(Draw.hue)
    })

    document.getElementById('size').addEventListener('input', e => {
        const example = document.getElementById('sizeExample').style
        example.width = (e.srcElement as HTMLInputElement).value
        example.height = (e.srcElement as HTMLInputElement).value
        example.marginBottom = (-(e.srcElement as HTMLInputElement).value / 2).toString()
        Draw.lineWidth = parseInt((e.srcElement as HTMLInputElement).value) * Surface.dpi;
    })

    document.getElementById('newWord').addEventListener('click', () => {
        (document.getElementById('newWord') as HTMLButtonElement).innerHTML = hardWords.words[Math.floor(Math.random() * hardWords.words.length)]
    })

    document.getElementById('clear').addEventListener('click', () => Draw.sync({ clear: true }));

    document.getElementById('undo').addEventListener('click', () => Draw.sync({ undo: true }));

})();
