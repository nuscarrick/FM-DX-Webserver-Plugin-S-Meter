/*
    Signal Meter Small by AAD
    https://github.com/AmateurAudioDude/FM-DX-Webserver-Plugin-S-Meter
    https://github.com/NO2CW/FM-DX-Webserver-analog-signal-meter
*/

isOutsideField = false;

(function() {
    function initAnalogMeterSmall() {
        document.addEventListener('DOMContentLoaded', function() {
            const panels = Array.from(document.querySelectorAll('.panel-33'));
            const container = panels.find(panel => panel.querySelector('h2') && panel.querySelector('h2').textContent.includes('SIGNAL'));

            const signalMeter = document.createElement('canvas');
            signalMeter.id = 'signal-meter-small-canvas';
            signalMeter.style.width = '256px';
            signalMeter.style.height = '12px';
            // Inside or outside SIGNAL field
            if (isOutsideField) {
                offset = -128;
                signalMeter.style.margin = '4px 0 0 ' + offset + 'px';
                signalMeter.style.position = 'absolute';
            } else {
                offset = 0;
                signalMeter.style.margin = '4px 0 0 ' + offset + 'px';
                signalMeter.style.position = 'relative';
            }
            container.appendChild(signalMeter);

            // Override breadcrumbs.css to make this canvas visible on mobile devices
            document.getElementById('signal-meter-small-canvas').style.display = 'inline-block';

            // Add tooltip
            signalMeter.classList.add("tooltip");
            signalMeter.setAttribute('data-tooltip', 'Click to toggle show/hide S-Meter.');

            const ctx = signalMeter.getContext('2d');
            signalMeter.width = 256;
            signalMeter.height = 12;

            const backgroundImage = new Image();
            backgroundImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAAYCAMAAAC7vLUXAAAAB3RJTUUH6AUZFiMj11d9+wAAAAlwSFlzAAAK8AAACvABQqw0mAAAAE5QTFRFAP8A/wAA/2Bg////////////AP8A/wAA////////////////////////////AP8A/wAA////////////////////////AP8A/2Bg////SV+9OwAAABd0Uk5TAAAAABAgMDAwQFBgcH+PkZGfr7/P3++KEr+hAAAEIElEQVRo3u2a3XbbKhCF07Oh1YBGCeKn3e//oucCFLu2kKV4JV2tzUXWivN5MjDbwwb5BVpI5gHP8ZDjZWSZNLDY51o8pgAiHYDA8bkWjyyA53hYASgZ/NMBPK4AMJFkfraBhxUAjJsSnxvB4woAAGbOH3r799fX7y8r4696fcc8f7y9/fi2Y/wV3IUJnAHAf1AArz9/vv7tr+8RwNuvX291CTeg/yp3M9gf5i4FwNmJL/RPATymAIZEkpzw3AIecwsARHX86D3gy78wdszz27801kzgh4fIMVz1wJ3DICIiu99gpI79ajZ+j/ZNTeEG61TrWljVjSOVcUuYbQ7AMpMtsM3Z3F7bTn73CcBG8gBuEknG3XzkIV5Yh+5+QyFZbrkfyYwt99IvRCTJAMBv5jyUJUN/a25jm8km2OYsQNices1vvg53lwBcyfmIAAJHmAOPHRg+0AEm7m1KphSBTf3nYFQAyshYc7e5mC41wgR6WCYLXamEEgByEdjEocvJkr4tgQr0wMYpWwfwDMbMV3Nfwk01P70Kd5cA4mziEQHMEwC733Du/yyfVTXv7hieHsDQz4dafzDCMALwa+KlAkiphar6y2VdADZ6AJ6uy70LIBZDBXrguwDa76kYwF6d5htW04f6q3B3CWAADgngbNl31ZLeOjHHwuvuBrCgTJsCGABGCBWAWbsuOcnUUduCTBzWO0DrhLbLLQJwdDVyB2zclCFuAFArnDo6cfSQcVgJd68JPCgA0Wl/AxAGkuXQkypT4gEptr24Y1eVUVXr4i5iiX0KSMU24lKGqhqpqgJ4nYvHOudVA4Oqr42MinXwxMWUSIYm0ItynDDlWKoHuAz3xQLwkWm/R2OykFLM5zQAIHMS7dgYbY6SmwI4pxDYKyx48qdTYnQdLjYsQovdEMCJi21vXxXAWTgWrR7gDwsAwMiw29SZtmF+SgOoh5jsYln9m4gwiEitwVizuBTAORXoAZS0JgARCVxOqCbQr3ODyMhRZLCL/VgP+M5hGAAgp+Zkfi/HCdO66CVfhft6ASAd3DWOfFnpUAMAAAP0H4MsuzsjhNXAhi5V649I03b5vgcwjF2ubtrKGGNkjkMPlPOZxtKcTM49D7A0iMtwXykAU5cvl929wh2s6bEGMMQRwNg3pWcCQMkAdI2tVKt/DWdKXj8FOHpUs97jasV8fBdAB2yVLalNe6YF5EqgyymgpHqivAr3pR1gZhAXdx/ubCletG/S724AiSpa+vHb1RkYAeUs4yqrAmBkUlX1MKV4WfuenSgAk4uKz5QuZ9X+Lq0O2LiJs7hEB2FyLl/daSzhdOEuw32pAEwgWfYf7odMMppPagDAEEnG23fBjAAmksluX1oytqTHzX+ZHW5xZ71lG5yWy0xfyCIbn43GXYT7H9cP20tGXSYXAAAAAElFTkSuQmCC';
            backgroundImage.onload = function() {
                ctx.drawImage(backgroundImage, 0, 0, signalMeter.width, signalMeter.height);
            };

            setInterval(function() {
                // Store current signal strength in variable
                const signalStrengthText = document.getElementById('data-signal') ? document.getElementById('data-signal').textContent : '0';
                let signalStrength = parseFloat(signalStrengthText);
                const textContent = localStorage.getItem('signalUnit');
                signalStrength += (textContent === 'dbm' ? 120 : textContent === 'dbuv' ? 11.25 : 0);

                // Store peak signal strength in variable
                const signalStrengthHighestText = document.getElementById('data-signal-highest') ? document.getElementById('data-signal-highest').textContent : '0';
                let signalStrengthHighest = parseFloat(signalStrengthHighestText);
                signalStrengthHighest += (textContent === 'dbm' ? 120 : textContent === 'dbuv' ? 11.25 : 0);

                // Resize if needed
                var width, margin;

                if (window.innerWidth > 768) {
                    switch (true) {
                        case (window.innerWidth <= 880):
                            width = '192px';
                            if (isOutsideField) { margin = (offset + 32) + 'px'; }
                            break;
                        case (window.innerWidth <= 928):
                            width = '208px';
                            if (isOutsideField) { margin = (offset + 24) + 'px'; }
                            break;
                        case (window.innerWidth <= 976):
                            width = '224px';
                            if (isOutsideField) { margin = (offset + 16) + 'px'; }
                            break;
                        case (window.innerWidth <= 1024):
                            width = '240px';
                            if (isOutsideField) { margin = (offset + 8) + 'px'; }
                            break;
                        default:
                            width = '256px';
                            margin = offset + 'px';
                    }
                    signalMeter.style.width = width;
                    signalMeter.width = parseInt(width);
                    signalMeter.style.margin = '4px 0 0 ' + margin;
                } else {
                    width = '256px';
                    margin = offset + 'px';
                    signalMeter.style.width = width;
                    signalMeter.width = parseInt(width);
                    signalMeter.style.margin = '2px 0 0 ' + margin;
                }

                // Attempt to detect maximised window
                var isAtMaxWidth = screen.availWidth - window.innerWidth === 0;

                if (!(/Mobi|Android/i.test(navigator.userAgent)) && isAtMaxWidth && window.innerHeight > 864) {
                    if (isOutsideField) {
                        signalMeter.style.margin = '10px 0 0 ' + margin;
                    } else {
                        signalMeter.style.margin = '0 0 0 ' + margin;
                    }
                }

                if (!isNaN(signalStrength)) {
                    drawSignalMeter(signalStrength, signalStrengthHighest, ctx, backgroundImage, signalMeter);
                }
            }, 200);

            // Set initial opacity from localStorage or default to 1 (visible)
            const savedOpacity = localStorage.getItem('signalMeterSmallVisibility');
            signalMeter.style.opacity = savedOpacity !== null ? savedOpacity : '1';

            // Toggle visibility when clicked and save state to localStorage
            signalMeter.addEventListener('click', function() {
                const currentOpacity = signalMeter.style.opacity;
                signalMeter.style.opacity = currentOpacity === '1' ? '0' : '1';
                localStorage.setItem('signalMeterSmallVisibility', signalMeter.style.opacity);
            });

            // Add hover effect for 50% opacity when opacity is 0%
            signalMeter.addEventListener('mouseover', function() {
                const currentOpacity = signalMeter.style.opacity;
                if (currentOpacity === '0') {
                    signalMeter.style.opacity = '0.15';
                }
            });

            // Remove hover effect when mouse leaves
            signalMeter.addEventListener('mouseleave', function() {
                const currentOpacity = signalMeter.style.opacity;
                if (currentOpacity === '0.15') {
                    signalMeter.style.opacity = '0';
                }
            });
        });
    }

    function drawSignalMeter(signalValue, signalValueHighest, ctx, backgroundImage, signalMeter) {
        // Clear the canvas before redrawing
        ctx.clearRect(0, 0, signalMeter.width, signalMeter.height);

        // Redraw the background image
        ctx.drawImage(backgroundImage, 0, 0, signalMeter.width, signalMeter.height);

        // Draw the dark gray line in the background
        ctx.beginPath();
        ctx.moveTo(8, 0); // Start from the top left corner
        ctx.lineTo(signalMeter.width, 0); // Move horizontally to the right
        ctx.strokeStyle = '#212223'; // Dark Grey
        ctx.lineWidth = 8;
        ctx.stroke();

        // Calculate the needle position
        const normalizedStrength = ((signalValue + 37) / (132)) * 100;
        const maxPosition = (signalMeter.width + 8) / 100;
        const needlePosition = Math.min(normalizedStrength * maxPosition, 256);

        const normalizedStrengthHighest = ((signalValueHighest + 37) / (132)) * 100;
        const needlePositionHighest = Math.min(normalizedStrengthHighest * maxPosition, 256);

        // Image signal locations in pixels:
        // 1, 32 | 2, 44 | 3, 56 | 4, 68 | 5, 80 | 6, 92 | 7, 104 | 8, 116 | 9, 128
        // +10, 148 | +20, 168 | +30, 188 | +40, 208 | +50, 228 | +60, 248
        //console.log(Math.round(normalizedStrength), Math.round(needlePosition));

        ctx.beginPath();
        ctx.moveTo(8, 0); // Start from the top left corner
        ctx.lineTo(Math.min(needlePositionHighest, signalMeter.width), 0); // Move horizontally to the right up to half width
        ctx.strokeStyle = '#313233'; // Grey
        ctx.lineWidth = 8;
        ctx.stroke();

        // Draw the first half of the needle in green
        ctx.beginPath();
        ctx.moveTo(8, 0); // Start from the top left corner
        ctx.lineTo(Math.min(needlePosition, signalMeter.width / 2), 0); // Move horizontally to the right up to half width
        ctx.strokeStyle = '#08B818'; // Green
        ctx.lineWidth = 8;
        ctx.stroke();

        // Draw the second half of the needle in red
        ctx.beginPath();
        ctx.moveTo(signalMeter.width / 2, 0); // Start from the top middle
        ctx.lineTo(Math.max(signalMeter.width / 2, needlePosition), 0); // Move horizontally to the right from half width
        ctx.strokeStyle = '#E01808'; // Red
        ctx.lineWidth = 8;
        ctx.stroke();
    }

    initAnalogMeterSmall();
})();
