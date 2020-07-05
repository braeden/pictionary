import { hardWords } from './words.js';
//@ts-ignore
const socket = io();
let previousDraws = [];
socket.emit('askRoom', window.location.pathname.split("/")[2] || '');
socket.on('givenRoom', (data) => {
    history.replaceState(null, '', `/g/${data}`);
});
socket.emit('requestSync');
socket.on('requestSync', (data) => {
    const output = Object.assign(Object.assign({}, data), { draws: previousDraws });
    socket.emit('drawSync', output);
});
socket.on('drawSync', data => {
    draw({
        clear: true
    });
    data.forEach((o) => {
        draw(o);
    });
});
socket.on('draw', draw);
//@ts-ignore
const c = document.getElementById('drawing');
const ctx = c.getContext("2d");
ctx.imageSmoothingEnabled = false;
c.width = window.innerWidth;
c.height = window.innerHeight;
let pos = {
    x: 0,
    y: 0
};
let drawEnable = true;
let lineWidth = 10;
let hue = 0;
(function setupListeners() {
    window.addEventListener('resize', resize);
    document.addEventListener('mousemove', prepareDraw);
    document.addEventListener('mousedown', prepareDraw);
    document.addEventListener('mouseenter', setPosition);
    document.addEventListener('mouseup', () => {
        drawEnable = true;
    });
    document.addEventListener('touchend', () => {
        drawEnable = true;
    });
    document.addEventListener('touchmove', prepareDraw);
    document.addEventListener('touchstart', prepareDraw);
    [...document.getElementsByTagName('input'), ...document.getElementsByTagName('button')].forEach(e => {
        disableDraw(e);
    });
    document.getElementById('color').addEventListener('input', (e) => {
        hue = parseInt(e.srcElement.value);
        document.getElementById('colorExample').style.backgroundColor = strokeStyle(hue);
    });
    document.getElementById('size').addEventListener('input', e => {
        const example = document.getElementById('sizeExample').style;
        example.width = e.srcElement.value;
        example.height = e.srcElement.value;
        example.marginBottom = (-e.srcElement.value / 2).toString();
        lineWidth = parseInt(e.srcElement.value);
    });
    document.getElementById('newWord').addEventListener('click', e => {
        e.srcElement.innerText = hardWords.words[Math.floor(Math.random() * hardWords.words.length)];
    });
    document.getElementById('clear').addEventListener("click", clear);
})();
function setPosition(e) {
    pos.x = e.clientX;
    pos.y = e.clientY;
}
function setPositionTouch(e) {
    pos.x = e.touches[0].pageX;
    pos.y = e.touches[0].pageY;
}
// resize canvas
function resize() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    socket.emit('requestSync');
}
function prepareDraw(e) {
    const touch = e.type == 'touchmove' || e.type == 'touchstart';
    const point = e.type == 'touchstart' || e.type == 'mousedown';
    if (!touch && e.buttons !== 1 || !drawEnable)
        return;
    const old = Object.assign({}, pos);
    touch ? setPositionTouch(e) : setPosition(e);
    const updated = Object.assign({}, pos);
    const o = {
        lineWidth: lineWidth,
        hue: hue,
        old,
        updated,
        width: c.width,
        point: point
    };
    draw(o);
    socket.emit('draw', o);
}
function draw(o) {
    if (o.clear) {
        previousDraws = [];
        ctx.clearRect(0, 0, c.width, c.height);
    }
    else {
        const scale = c.width / o.width;
        ctx.beginPath();
        ctx.strokeStyle = strokeStyle(o.hue);
        ctx.lineCap = 'round';
        if (o.point) {
            ctx.lineWidth = 1;
            ctx.fillStyle = strokeStyle(o.hue);
            ctx.arc(o.updated.x * scale, o.updated.y * scale, o.lineWidth * scale / 2, 0, 2 * Math.PI);
        }
        else {
            ctx.lineWidth = o.lineWidth * scale;
            ctx.moveTo(o.old.x * scale, o.old.y * scale);
            ctx.lineTo(o.updated.x * scale, o.updated.y * scale);
        }
        ctx.stroke();
        ctx.fill();
        previousDraws.push(o);
    }
}
function clear() {
    const o = {
        clear: true
    };
    draw(o);
    socket.emit('draw', o);
}
function disableDraw(e) {
    e.addEventListener('mousedown', () => {
        drawEnable = false;
    });
    e.addEventListener('touchstart', () => {
        drawEnable = false;
    });
}
const strokeStyle = (value) => `hsl(${value}, 100%, ${value % 360 === 0 ? (value / 360) * 100 : 50}%)`;
