window.onload = function () {
    document.querySelectorAll('.video-player').forEach(function (el) {
        let xyz = ``
        let PP = '';
        let PPS = ''
        if (el.src) {
            xyz += `src="${el.src}"`
        }
        if (el.autoplay) {
            xyz += `autostart`
        }
        if (el.preload) {
            xyz += `preload="${el.preload}"`
        }
        if (el.loop) {
            xyz += `autoloop="${el.loop}"`
        }
        if (!!window.chrome) {
            PP = `<div class="vid-PiP"><img src="./video-player/PIP.svg"></div>`
            PPS = `pps`
        }
        el.outerHTML = `<div class="vid-con"><video class="video-player" ${xyz} tabindex="0"></video><div class="vid-el1"><img src="./video-player/pause.svg"></div><div class="vid-el2 ${PPS}"><div>00:00</div><div class="timeLine"><input type="range" min="0" max='200' value="0"><canvas class="vid-loaded"></canvas></div><div>00:00</div><div class="vol"><img src="./video-player/vol3.svg" alt="Vol"><input type="range" min="0" max="100" step="10" value="100"></div><div class="vid-FullScR"><img src="./video-player/fullscreen.svg"></div>${PP}</div></div>`
    })
    let video = document.querySelectorAll('.vid-con .video-player')
    let vidEl1 = document.querySelectorAll('.vid-con .vid-el1')
    let vidEl2 = document.querySelectorAll('.vid-con .vid-el2')
    let timeLine = document.querySelectorAll('.vid-con .vid-el2 .timeLine input')
    let volLine = document.querySelectorAll('.vid-con .vid-el2 .vol input')
    let volShow = document.querySelectorAll('.vid-con .vid-el2 .vol img')
    let img = document.querySelectorAll('.vid-con img')
    let loop = document.querySelectorAll('.vid-con .video-player[autoloop="true"]')
    let vidFullScR = document.querySelectorAll('.vid-con .vid-el2 .vid-FullScR')
    let vidPiP = document.querySelectorAll('.vid-con .vid-el2 .vid-PiP')
    video.forEach(function (el) {
        el.addEventListener('click', function () {
            playPause(el)
        })
        el.addEventListener('keydown', function (e) {
            keyAction(el, e)
        })
        el.addEventListener('keypress', function (e) {
            keyPreSS(el, e)
        })

        if (el.getAttributeNames().includes('autostart')) {
            console.log('me');
            el.click();
        }

        function duraVali() {
            if (isNaN(el.duration)) {
                setTimeout(() => {
                    duraVali()
                }, 1000);
            } else {
                dura(el)
            }
        }
        duraVali()
        Buff(el)
        el.onplay = () => {
            el.nextSibling.style = `display:none;`
            currTime(el, el.nextSibling.nextSibling.childNodes[0])
        }
        el.onpause = () => {
            el.nextSibling.style = `display:block;`
        }
    })
    //click on video
    vidEl1.forEach(function (el) {
        el.addEventListener('click', () => {
            el.previousSibling.click()
            el.previousSibling.focus();
        })
    })
    //play pause
    function playPause(xx) {
        if (xx.paused) {
            xx.play()
        } else {
            xx.pause()
        }
    }
    //video timeline
    timeLine.forEach(function (el) {
        el.addEventListener('input', function () {
            let xx = el.parentNode.parentNode.parentNode.childNodes[0];
            xx.currentTime = el.value
            let yy = (el.parentNode.previousSibling);
            currTime(xx, yy, 'now')
        })
    })
    //volume line
    volLine.forEach(function (el) {
        el.addEventListener('input', function () {
            let aa = el.value / 100;
            let bb = el.parentNode.parentNode.parentNode.childNodes[0]
            bb.volume = aa;
            displayVol(aa, el.previousSibling)
        })
    })
    //mute-unmute
    volShow.forEach(function (el) {
        el.addEventListener('click', function () {
            let bb = el.parentNode.parentNode.parentNode.childNodes[0]
            if (bb.muted) {
                bb.muted = false
                el.nextSibling.value = 100;
                el.src = './video-player/vol3.svg'
            } else {
                bb.muted = true;
                el.nextSibling.value = 0;
                el.src = './video-player/vol0.svg'
            }
        })
    })
    //video duraiton
    function dura(xx) {
        let final;
        let aa = xx.duration
        let bb = (aa / 60).toString().split('.')
        let cc = Math.round(parseFloat('0.' + bb[1]) * 60)
        if (bb[0].length === 1) bb[0] = 0 + bb[0];
        if (cc >= 0 && cc < 10) cc = '0' + cc;
        if (parseInt(bb[0]) === 0) {
            final = `00:${cc}`
        } else {
            final = `${bb[0]}:${cc}`
        }
        let xyz = xx.parentNode.childNodes[2].childNodes[1].childNodes[0]
        xyz.setAttribute('max', Math.round(aa))
        xyz.parentNode.nextSibling.textContent = final;
    }
    //currentTime Video
    function currTime(xx, zz, yy) {
        function abc() {
            let final;
            let aa = xx.currentTime
            let bb = (aa / 60).toString().split('.')
            let cc = Math.round(parseFloat('0.' + bb[1]) * 60)
            if (bb[0].length === 1) bb[0] = 0 + bb[0];
            if (cc >= 0 && cc < 10) cc = '0' + cc;
            if (parseInt(bb[0]) === 0) {
                final = `00:${cc}`
            } else {
                final = `${bb[0]}:${cc}`
            }
            xx.nextSibling.nextSibling.childNodes[1].childNodes[0].value = Math.round(aa);
            zz.textContent = final
        }
        if (yy === 'now') {
            abc()
        } else {
            let Int = setInterval(() => {
                abc()
            }, 1000);
            xx.addEventListener('pause', function () {
                clearInterval(Int)
            })
            xx.addEventListener('ended', function () {
                clearInterval(Int)
            })
        }
    }
    //action on keydown
    function keyAction(a, b) {
        if (b.keyCode === 39) {
            a.currentTime += 5;
            currTime(a, a.nextSibling.nextSibling.childNodes[0], 'now')
        }
        if (b.keyCode === 37) {
            a.currentTime -= 5;
            currTime(a, a.nextSibling.nextSibling.childNodes[0], 'now')
        }
        if (b.keyCode === 38 && a.volume < 1) {
            a.volume += 0.1;
            displayVol(a.volume, a.nextSibling.nextSibling.childNodes[3].childNodes[0])
            a.nextSibling.nextSibling.childNodes[3].childNodes[1].value += 10
        }
        if (b.keyCode === 40 && a.volume > 0.1) {
            a.volume -= 0.1;
            displayVol(a.volume, a.nextSibling.nextSibling.childNodes[3].childNodes[0])
            a.nextSibling.nextSibling.childNodes[3].childNodes[1].value -= 10
        }
    }
    //action on keypress
    function keyPreSS(el, e) {
        if (e.keyCode === 102 || e.keyCode === 53) {
            if (document.fullscreenElement !== el.parentNode) {
                el.parentNode.requestFullscreen()
            } else if (document.fullscreenElement) {
                document.exitFullscreen()
            }
        }
        if (e.keyCode === 32) {
            playPause(el)
        }
    }
    //volume icons
    function displayVol(aa, el) {
        if (aa < 0.1) {
            el.src = './video-player/vol0.svg'
        } else if (aa >= 0.1 && aa <= 0.3) {
            el.src = './video-player/vol1.svg'
        } else if (aa >= 0.4 && aa <= 0.6) {
            el.src = './video-player/vol2.svg'
        } else if (aa >= 0.7 && aa <= 1) {
            el.src = './video-player/vol3.svg'
        }
    }
    vidEl2.forEach(function (el) {
        let vid = el.parentNode
        el.style = 'transform: translateY(200%);'
        vid.onmouseleave = (() => {
            el.style = 'transform: translateY(200%);transition-delay: 2s;'
        })
        vid.onmouseover = (() => {
            el.style = 'transform: translateY(0%);'
        })
    })
    img.forEach(function (el) {
        el.setAttribute('draggable', false)
    })

    function Buff(el) {
        let canvas = el.nextSibling.nextSibling.childNodes[1].childNodes[1]

        function drawProgress(canvas, buffered, duration) {
            var context = canvas.getContext('2d', {
                antialias: false
            });
            context.fillStyle = 'aqua'
            var width = canvas.width;
            var height = canvas.height;
            context.clearRect(0, 0, width, height);

            for (var i = 0; i < buffered.length; i++) {
                var leadingEdge = buffered.start(i) / duration * width;
                var trailingEdge = buffered.end(i) / duration * width;
                context.fillRect(leadingEdge, 0, trailingEdge - leadingEdge, height);
            }
        }

        el.addEventListener('progress', () => {
            drawProgress(canvas, el.buffered, el.duration);
        }, false);
    }
    loop.forEach(function (el) {
        el.addEventListener('ended', function () {
            playPause(el)
        })
    })
    vidFullScR.forEach(function (el) {
        el.addEventListener('click', function () {
            let aa = el.parentNode.parentNode
            if (document.fullscreenElement !== aa) {
                aa.requestFullscreen()
            } else if (document.fullscreenElement) {
                document.exitFullscreen()
            }
        })
    })
    vidPiP.forEach(function (el) {
        el.addEventListener('click', function () {
            if (document.pictureInPictureElement) {
                document.exitPictureInPicture()
            } else el.parentNode.previousSibling.previousSibling.requestPictureInPicture()
        })
    })
}