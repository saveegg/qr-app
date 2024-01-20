
const
    el = {},
    usingOffscreenCanvas = isOffscreenCanvasWorking();

document
    .querySelectorAll('[id]')
    .forEach(element => el[element.id] = element)

let
    offCanvas,
    requestId = null;

function isOffscreenCanvasWorking() {
    try {
        return Boolean((new OffscreenCanvas(1, 1)).getContext('2d', { willReadFrequently: true }));
    } catch {
        return false
    }
}

function checkQRCodeValidity(qrCode) {
    const apiUrl = '/api/validate_qr';

    const postData = {
        qr_code: qrCode
    };

    const fetchOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    };

    if (qrCode) {
        fetch(apiUrl, fetchOptions)
            .then(response => {
                if (!response.ok) {
                    if (response.status === 400) {
                        el.result.innerText = 'Invalid QR code';
                        el.canvas.style.display = 'none';
                        throw new Error('Bad Request - Invalid QR code');
                    } else {
                        el.result.innerText = 'Invalid QR code';
                        el.canvas.style.display = 'none';
                        throw new Error('Bad Request - Invalid QR code');
                    }
                }
                return response.json();
            })
            .then(data => {
                let message = "Name: " + data.name + "\n" + "Email: " + data.email + "\n" + "Amount: " + data.amount;
                el.result.innerText = message;
                el.canvas.style.display = 'none';
            })
            .catch(error => {
                console.error('Error:', error);
                el.result.innerText = 'Invalid QR code';
                el.canvas.style.display = 'none';
            });
    }
}

function detect(source) {
    const
        canvas = el.canvas,
        ctx = canvas.getContext('2d');

    function getOffCtx2d(width, height) {
        if (usingOffscreenCanvas) {
            if (!offCanvas || (offCanvas.width !== width) || (offCanvas.height !== height)) {
                // Only resizing the canvas caused Chromium to become progressively slower
                offCanvas = new OffscreenCanvas(width, height)
            }

            return offCanvas.getContext('2d')
        }
    }

    canvas.width = source.naturalWidth || source.videoWidth || source.width
    canvas.height = source.naturalHeight || source.videoHeight || source.height

    if (canvas.height && canvas.width) {
        const offCtx = getOffCtx2d(canvas.width, canvas.height) || ctx

        offCtx.drawImage(source, 0, 0)

        const
            imageData = offCtx.getImageData(0, 0, canvas.width, canvas.height);

        return zbarWasm
            .scanImageData(imageData)
            .then(symbols => {
                symbols.forEach(symbol => {
                    const lastPoint = symbol.points[symbol.points.length - 1]
                    ctx.moveTo(lastPoint.x, lastPoint.y)
                    symbol.points.forEach(point => ctx.lineTo(point.x, point.y))

                    ctx.lineWidth = Math.max(Math.min(canvas.height, canvas.width) / 100, 1)
                })

                symbols.forEach(s => s.rawValue = s.decode('utf-8'))

                symbols.forEach(s => {
                    delete s.type
                    delete s.data
                    delete s.points
                    delete s.time
                    delete s.cacheCount
                })

                if (symbols[0]) {
                    const rawValue = symbols[0].rawValue;
                    checkQRCodeValidity(rawValue);
                }
            })

    } else {
        return Promise.resolve()
    }
}

function detectVideo(active) {
    if (active) {
        detect(el.video)
            .then(() => {
                if (el.result.innerText !== '') { // If a QR code is detected
                    el.video.srcObject.getTracks().forEach(track => track.stop()); // Stop the video stream
                    el.video.srcObject = null;
                    detectVideo(false);
                } else {
                    requestId = requestAnimationFrame(() => detectVideo(true)); // Continue detection
                }
            });
    } else {
        cancelAnimationFrame(requestId);
        requestId = null;
    }
}

el.videoBtn.addEventListener('click', event => {
    if (!requestId) {
        navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: 'environment' } })
            .then(stream => {
                el.video.srcObject = stream
                detectVideo(true);
            })
            .catch(error => {
                console.log(error);
            })
    } else {
        detectVideo(false);
    }
})
