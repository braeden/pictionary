import { hardWords } from './words.js';
//@ts-ignore
const socket = io();
class Surface {
    static setup() {
        Surface.ctx.imageSmoothingEnabled = false;
        Surface.c.height = Surface.c.clientHeight * Surface.dpi;
        Surface.c.width = Surface.c.clientWidth * Surface.dpi;
    }
    static resize() {
        Surface.setup();
        socket.emit('requestSync');
    }
}
//@ts-ignore
Surface.c = document.getElementById('drawing');
Surface.ctx = Surface.c.getContext('2d');
Surface.dpi = window.devicePixelRatio || 1;
Surface.setup();
class Draw {
    static draw(o) {
        if (o.clear) {
            Surface.ctx.clearRect(0, 0, Surface.c.width, Surface.c.height);
            Draw.previous = [];
        }
        else if (o.undo) {
            Draw.previous.splice(-5, 5);
            Draw.fromScratch(Draw.previous);
        }
        else {
            const scale = Surface.c.width / o.w;
            Surface.ctx.beginPath();
            Surface.ctx.strokeStyle = o.h;
            Surface.ctx.lineCap = 'round';
            if (o.p) {
                Surface.ctx.lineWidth = 1;
                Surface.ctx.fillStyle = o.h;
                Surface.ctx.arc(o.up.x * scale, o.up.y * scale, o.l * scale / 2, 0, 2 * Math.PI);
            }
            else {
                Surface.ctx.lineWidth = o.l * scale;
                Surface.ctx.moveTo(o.old.x * scale, o.old.y * scale);
                Surface.ctx.lineTo(o.up.x * scale, o.up.y * scale);
                Draw.previous.push(o);
            }
            Surface.ctx.stroke();
            Surface.ctx.fill();
        }
    }
    static fromScratch(array) {
        Draw.draw({
            clear: true
        });
        array.forEach((o) => {
            Draw.draw(o);
        });
    }
    static handleEvent(e) {
        const point = e.type == 'touchstart' || e.type == 'mousedown';
        if (e instanceof MouseEvent && e.buttons !== 1 || !Draw.enable)
            return;
        e.preventDefault();
        const old = Object.assign({}, Draw.pos);
        e instanceof TouchEvent ? Draw.setPositionTouch(e) : Draw.setPosition(e);
        const up = Object.assign({}, Draw.pos);
        const o = {
            l: Draw.lineWidth,
            h: Draw.hue,
            old,
            up,
            w: Surface.c.width,
            p: point
        };
        Draw.draw(o);
        socket.emit('draw', o);
    }
    static setPosition(e) {
        Draw.pos.x = e.clientX * Surface.dpi;
        Draw.pos.y = e.clientY * Surface.dpi;
    }
    static setPositionTouch(e) {
        Draw.pos.x = e.touches[0].pageX * Surface.dpi;
        Draw.pos.y = e.touches[0].pageY * Surface.dpi;
    }
    static sync(o) {
        Draw.draw(o);
        socket.emit('draw', o);
    }
}
Draw.previous = [];
Draw.pos = {
    x: 0,
    y: 0
};
Draw.enable = true;
Draw.lineWidth = 10 * Surface.dpi;
Draw.hue = "#000000";
socket.emit('askRoom', window.location.pathname.split("/")[2] || '');
socket.on('givenRoom', (data) => {
    history.replaceState(null, '', `/g/${data}`);
});
socket.emit('requestSync');
socket.on('requestSync', (data) => {
    const output = Object.assign(Object.assign({}, data), { draws: Draw.previous });
    socket.emit('drawSync', output);
});
socket.on('drawSync', Draw.fromScratch);
socket.on('draw', Draw.draw);
(function setupListeners() {
    window.addEventListener('resize', Surface.resize);
    ['mousemove', 'mousedown', 'touchmove', 'touchstart'].forEach(event => {
        document.getElementById('drawing').addEventListener(event, Draw.handleEvent);
    });
    document.getElementById('drawing').addEventListener('mouseenter', Draw.setPosition);
    document.getElementById('color').addEventListener('input', (e) => {
        Draw.hue = e.target.value;
    });
    document.getElementById('size').addEventListener('input', e => {
        const example = document.getElementById('sizeExample').style;
        example.width = e.target.value;
        example.height = e.target.value;
        example.marginBottom = (-e.target.value / 2).toString();
        Draw.lineWidth = parseInt(e.target.value) * Surface.dpi;
    });
    document.getElementById('newWord').addEventListener('click', () => {
        document.getElementById('newWord').innerHTML = hardWords.words[Math.floor(Math.random() * hardWords.words.length)];
    });
    document.getElementById('clear').addEventListener('click', () => Draw.sync({ clear: true }));
    document.getElementById('undo').addEventListener('click', () => Draw.sync({ undo: true }));
})();
