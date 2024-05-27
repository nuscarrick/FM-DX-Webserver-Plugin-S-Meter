/*
    Signal Meter Small v1.1.1 by AAD
    https://github.com/AmateurAudioDude/FM-DX-Webserver-Plugin-S-Meter
    https://github.com/NO2CW/FM-DX-Webserver-analog-signal-meter
*/

isOutsideField = true;
enableLowSignalInterpolation = true;

(function() {
    function initAnalogMeterSmall() {
        document.addEventListener('DOMContentLoaded', function() {
            debugMode = false; // For personal use only

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
            backgroundImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAAYCAMAAAC7vLUXAAAAB3RJTUUH6AUbFjAAvtaFkAAAAAlwSFlzAAAK8AAACvABQqw0mAAAAE5QTFRFAP8A/wAA/2Bg////////////AP8A/wAA////////////////////////////AP8A/wAA////////////////////////AP8A/2Bg////SV+9OwAAABd0Uk5TAAAAABAgMDAwQFBgcH+PkZGfr7/P3++KEr+hAAAEHUlEQVRo3u2a23rbIBCE0w60WtDKRhySef8X7QUodhMdm+RzW5uLXDi/1ws7XgbkJ2ghmTs8xl2Op55l0MBiH2txnwKIdAAC+8da3LMAHuNuBaBk8A8HcL8CwECS+dEG7lYAMG5IfGwE9ysAABg5fijMj9Ppx9PM+Kde3zHPn+fzz287xj/BNRM4AoD/oABOz8+nupTvX1/i/47Xa9an5+fTHgGcX17Om9D3v5mrAji/vJwnAXB04gv9QwD3KYAukSQHPLaA+9wCAFHtP3oP+PQ/jB3z/PY/jWsT+OEhcgxXPXD30ImIyO43GKljv6qN3/MdMDWFDdap1rWwqitHK+OmMOscgDaTVa7N2Wyv7Zv8PkcANpIHcJNIMu7mIw/xwjp09xsKybLlgiQzttzLYiVMJMkAwK/m3JUpQ781t34P1+YsQFides1vvMT7FAG4kvMRAQT2MAcePzD8QQcYuLcpmVIENi0/D6MCUEbGmrvNxSxSPUygh2Wy0JlKKAEgF4FN7BY5mdK3JVCxxSlbB/AMxozv5j6FG2p++hrvUwQQRxOPCGAcANj9xnP/d/mqqnl3x/D0ALrlfKj1DyMMIwA/J14qgJRaqKq/XOYFYKMH4OkWuVcBxGKo2OJ0Wv9UDGDfneobVtOH+td4nyKADjgkgKtl31VLeuvEHAuvuxvAhDKtCqADGCFUAGbu2uQiU0dtCzKwm+8ArRPaRW4SgKMDFVvckCGuA1ArnMo85ughfYdLvM8ygQcFIDrsbwDCQLIcemJlSjwgxbbHLthVZVTVuriTWOIyBaRiG/FWhqoaqaoCeB2LxzznVQODqq+NjLrJxZRIhibQN+W4YMq+VA8wxbuRAHxk2u/RmCykFPM1DQDIHEQXbIw2R8lVAVxTCFwqLHjxp0NidAtcbFiEFrsigAsX294+K4CrcCxaPcCNBQCgZ9ht6kzbML+kAdRDTHaxzP5PRBhEpJa9r1m8FcA1FegBlDQnABEJnE6oJtDPc51Iz16ks5P92ODQdQCQU3Myv5fjgmld9JJf491OAEgHd40jP1o61AAAwADLj0Om3Z0RwmpgwyJV649I03b5ZQ9gGBe5umkrY4yROXbr3FSF0pxMzkseYGoQU7xbCMDU5ctld69wB2t6rAF0sQfQL5vSKwGgZAA6x1aq1b+GMyXPnwIcPapZX+JqxXycBLDO1S+0KREjLSDvBDqdAkoCYJleP/cmHWBkEBd3H+5sKV502aR/uAEkqmhZjt+uzsAIKEfpZ1kVAD2TqqqHKcXL3O/tRAGYXFR8pixyVu1v0trgBo7iEh2Eybn87k5jCqcTN8W7iQBMIFn2H+67TDKaL2oAQBdJxu27YEYAA8lk1y8tGVvS/epHZoct7uoYus4N02WmL2SRle9G41q8X1rg2uxvcVCaAAAAAElFTkSuQmCC';
            backgroundImage.onload = function() {
                ctx.drawImage(backgroundImage, 0, 0, signalMeter.width, signalMeter.height);
            };

            setInterval(function() {
                // Store current signal strength in variable
                const signalStrengthText = document.getElementById('data-signal') ? document.getElementById('data-signal').textContent : '0';
                const signalStrengthDecimalText = document.getElementById('data-signal-decimal') ? document.getElementById('data-signal-decimal').textContent : '0';
                signalStrength = parseFloat(signalStrengthText) - parseFloat(signalStrengthDecimalText);
                const textContent = localStorage.getItem('signalUnit');
                signalStrength += (textContent === 'dbm' ? 120 : textContent === 'dbuv' ? 11.25 : 0);

                // Store peak signal strength in variable
                const signalStrengthHighestText = document.getElementById('data-signal-highest') ? document.getElementById('data-signal-highest').textContent : '0';
                signalStrengthHighest = parseFloat(signalStrengthHighestText);
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
        const maxPosition = (signalMeter.width + 8) / 100;

        const normalizedStrength = ((signalValue + 37) / (132)) * 100;
        needlePosition = Math.min(normalizedStrength * maxPosition, 256);

        const normalizedStrengthHighest = ((signalValueHighest + 37) / (132)) * 100;
        needlePositionHighest = Math.min(normalizedStrengthHighest * maxPosition, 256);

        // Low signal interpolation
        if (enableLowSignalInterpolation) {
        var sRepValue = 72; // Value in px of the TEF noise floor
        var sIntValue = 24; // Value in px of the iterpolated noise floor
        var sMaxValue = 86; // Value in px where signal begins to deviate
            if (needlePosition < sMaxValue) { needlePosition = sIntValue + (needlePosition - sRepValue) * (sMaxValue - sIntValue) / (sMaxValue - sRepValue); }
            if (needlePositionHighest < sMaxValue) { needlePositionHighest = sIntValue + (needlePositionHighest - sRepValue) * (sMaxValue - sIntValue) / (sMaxValue - sRepValue); }
        }

        // Never fall below line starting position
        needlePosition = Math.max(needlePosition, 9);
        needlePositionHighest = Math.max(needlePositionHighest, 9);

        // Image signal locations in pixels:
        // 0, 20 | 1, 32 | 2, 44 | 3, 56 | 4, 68 | 5, 80 | 6, 92 | 7, 104 | 8, 116 | 9, 128
        // +10, 148 | +20, 168 | +30, 188 | +40, 208 | +50, 228 | +60, 248
        if (debugMode) { console.log('normalizedStrength: ' + Math.round(normalizedStrength), '|| needlePosition: ' + Math.round(needlePosition), '|| signalStrength: ' + (signalStrength).toFixed(1), '|| signalStrengthHighest: ' + (signalStrengthHighest).toFixed(1)); }

        ctx.beginPath();
        ctx.moveTo(8, 0); // Start from the top left corner
        ctx.lineTo(Math.min((needlePositionHighest + 4), signalMeter.width), 0); // Move horizontally to the right up to half width
        ctx.strokeStyle = '#333538'; // Grey
        ctx.lineWidth = 8;
        ctx.stroke();

        // Draw the first half of the needle in green
        ctx.beginPath();
        ctx.moveTo(8, 0); // Start from the top left corner
        ctx.lineTo(Math.min(needlePosition, signalMeter.width / 2) + 4, 0); // Move horizontally to the right up to half width
        ctx.strokeStyle = '#08B818'; // Green
        if (debugMode) { if (needlePosition < sMaxValue) { ctx.strokeStyle = '#08FF18'; } }
        ctx.lineWidth = 8;
        ctx.stroke();

        // Draw the second half of the needle in red
        ctx.beginPath();
        ctx.moveTo((signalMeter.width / 2) + 4, 0); // Start from the top middle
        ctx.lineTo(Math.max((signalMeter.width / 2) + 4, needlePosition + 4), 0); // Move horizontally to the right from half width
        ctx.strokeStyle = '#E01808'; // Red
        ctx.lineWidth = 8;
        ctx.stroke();
    }

    initAnalogMeterSmall();
})();
