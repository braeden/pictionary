import {
    hardWords
} from './words.js'

const socket = io();
socket.emit('askRoom', window.location.pathname.split("/")[2] || '');
socket.on('givenRoom', (data) => {
    console.log('given room ', data)
    history.replaceState(null, '', `/g/${data}`)
})

socket.on('draw', draw)

const c = document.getElementById('drawing')
const ctx = c.getContext("2d")
c.width = window.innerWidth
c.height = window.innerHeight
let pos = {
    x: 0,
    y: 0
}
let drawEnable = true;
let lineWidth = 5;
let strokeStyle = '#000';

(function setupListeners() {

    window.addEventListener('resize', resize);
    document.addEventListener('mousemove', prepareDraw);
    document.addEventListener('mousedown', setPosition);
    document.addEventListener('mouseenter', setPosition);
    document.addEventListener('mouseup', () => {
        drawEnable = true
    })
    document.addEventListener('touchend', () => {
        drawEnable = true
    })

    document.addEventListener('touchmove', prepareDraw);
    document.addEventListener('touchstart', setPositionTouch);


    [...document.getElementsByTagName('input')].forEach(e => {
        e.addEventListener('mousedown', () => {
            drawEnable = false
        })
        e.addEventListener('touchstart', () => {
            drawEnable = false
        })
    });
    document.getElementById('color').addEventListener('input', e => {
        const value = e.srcElement.value;
        strokeStyle = `hsl(${value}, 100%, ${value % 360 === 0 ? (value/360)*100 : 50}%)`
        document.getElementById('colorExample').style.backgroundColor = strokeStyle;
    })

    document.getElementById('size').addEventListener('input', e => {
        lineWidth = e.srcElement.value;
    })

    document.getElementById('newWord').addEventListener('click', e => {
        e.srcElement.innerText = hardWords.words[Math.floor(Math.random() * hardWords.words.length)]
    })

})();
// new position from mouse event
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
}

function prepareDraw(e) {
    const touch = e.type == 'touchmove'
    if (!touch && e.buttons !== 1 || !drawEnable) return;
    const old = {
        ...pos
    }
    touch ? setPositionTouch(e) : setPosition(e);
    const updated = {
        ...pos
    }
    const o = {
        lineWidth: lineWidth,
        strokeStyle: strokeStyle,
        old,
        updated,
        width: c.width,
        height: c.height
    }
    draw(o)
    socket.emit('draw', o)
}

function draw(o) {
    const scale = c.width / o.width
    ctx.beginPath();
    ctx.lineWidth = o.lineWidth * scale
    ctx.strokeStyle = o.strokeStyle
    ctx.lineCap = 'round'
    ctx.moveTo(o.old.x * scale, o.old.y * scale);
    ctx.lineTo(o.updated.x * scale, o.updated.y * scale);
    ctx.stroke();
}