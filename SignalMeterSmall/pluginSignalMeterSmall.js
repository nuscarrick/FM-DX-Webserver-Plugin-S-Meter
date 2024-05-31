/*
    Signal Meter Small v1.1.4 by AAD
    https://github.com/AmateurAudioDude/FM-DX-Webserver-Plugin-S-Meter
    https://github.com/NO2CW/FM-DX-Webserver-analog-signal-meter
*/

isOutsideField = true;
enableLowSignalInterpolation = true;

(function() {
    function initAnalogMeterSmall() {
        document.addEventListener('DOMContentLoaded', function() {
            debugMode = false; // For debugging purposes only

            const panels = Array.from(document.querySelectorAll('.panel-33'));
            const container = panels.find(panel => panel.querySelector('h2') && panel.querySelector('h2').textContent.includes('SIGNAL'));

            const signalMeter = document.createElement('canvas');
            signalMeter.id = 'signal-meter-small-canvas';
            signalMeter.style.width = '256px';
            signalMeter.style.height = '12px';
            // Hacky solution to prevent cropped canvas caused by #wrapper transform property, and other elements
            signalMeter.style.transform = 'translate(0, 0.1%)';
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
            signalMeter.classList.add('tooltip');
            signalMeter.setAttribute('data-tooltip', 'Click to toggle show/hide S-Meter.');

            const ctx = signalMeter.getContext('2d');
            signalMeter.width = 256;
            signalMeter.height = 12;

            const backgroundImage = new Image();
            backgroundImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAAYCAMAAAC7vLUXAAAAB3RJTUUH6AUcBgQzO92MuAAAAAlwSFlzAAAK8AAACvABQqw0mAAAAE5QTFRFAP8A/wAA/2Bg////////////AP8A/wAA////////////////////////////AP8A/wAA////////////////////////AP8A/2Bg////SV+9OwAAABd0Uk5TAAAAABAgMDAwQFBgcH+PkZGfr7/P3++KEr+hAAAEIUlEQVRo3u2ay3rbOAyF0zlkK5CCEooX57z/i86C1MRNRF3cL5m2NhdeyL9gEDgCQcpP0EIyD3iMuxxPI8ukgcU+YnGfAoh0AALHRyzuWQCPcbcCUDL4RwdwvwLARJL5UQbuVgAwbkp8LAT3KwAAmDmfuu378/P3p5XxR10/MM8fLy8/vh0YfwTXaQJnAPA9AVwuq5efL5fnGsqP13v873G9ev18uTwfEcDL6+vLLvTP78xVAby8vr70BMDZiS/0DwHcpwCGRJKc8FgC7nMJAER1PHsO+PQ3jAPz/PY3ja0m8PQQOYernjhrGERE5PANRuo4rmLjj2jeVBd2WKdaY2FVN7ZSxi1mtjkAbSabXJuz2Y/tjn+3CcBG8gRuEknGw3zkKV5Yhx6+oZAsfo/KjM330s2EiSQZAPhNn4eyeOj35jYe4dqcBQibU6/+zX17NwnAlZzPCCBwhDnxuoHhhgow8WhRMqUIbOq//6ICUEbG6rvNxXSpESbQwzJZ6EomlACQi8AmDl1OFvdtCVTsccpWATyDMfOHuS/mpuqfdu3dJIA4m3hGAPMEwB5vNI8/y1dZzYcrhqcHMPT9odYPRhhGAH5NvFQAKTVTVX+5rAvARg/A03W5/wQQi6Fij9Ml/qkYwH7YxTesug/1XXs3CWAATgngKuyHcklvnZhz5vVwAVhQpk0BDAAjhArArB2TvMnUUVtAJg7rFaBVQtvlFgE4OlCxx00Z4gYANcOprGOOHjIO6Nu7tQk8KQDR6XgBEAaS5dQbKlPiCSm2NbbTriqjqtbgLmKJfQpIxTbivQxVNVJVBfA6F491zqsGBlVfCxl1l4spkQxNoO/S8YYpx1J7gHX/vkwAPjId79GYLKQU8zkFAMicRDttjLaOkpsCuKYQ2Ess+NafTonRdbjYsAgtdkMAb1xsa/uqAK7MsWjtAf5nAQAYGQ43daYtmJ9SAOomJrtYVr8TEQYRqWkfqxfvBXBNBXoAJa0FWEQClx2qCfTr3CAychQZ7NJ+7HAYBgDIqXUyP6fjDdMa9JI7/n2lAJBOrhpn/qR0qgAAgAH677+W1Z0RwtrAhi5V849I01b5fg9gGLtcXbSVMcbIHIdtbslCaZ1Mzr0eYCkQPXtfIQBTw5fL4VrhTub0XAEY4ghg7DelVwJAyQB0ja1Uy381Z0pe3wU4etRmvcfVjPm4CGCbqw+0KREzLSAfBLrsAkoCYJm6v/slFWBmEBcPb+5sKV6036T/cgFIVNHSt9+OzsAIKGcZV1kVACOTqqqHKcXL2v/rRAGYXFR8pnQ5q/Ynae1wE2dxiQ7C5Fz+cKaxmNOF69n7EgGYQLIc39wPmWQ0n1QAgCGSjPtnwYwAJpLJbh9aMjanx82fzA573NU2dJublsNMX8giG89G4zr2/gV4NNtVw6gakwAAAABJRU5ErkJggg==';
            backgroundImage.onload = function() {
                ctx.drawImage(backgroundImage, 0, 0, signalMeter.width, signalMeter.height);
            };

            setInterval(function() {
                // Store current signal strength in variable
                const signalStrengthText = document.getElementById('data-signal') ? document.getElementById('data-signal').textContent : '0';
                const signalStrengthDecimalText = document.getElementById('data-signal-decimal') ? document.getElementById('data-signal-decimal').textContent : '0';
                signalStrength = parseFloat(signalStrengthText) + (signalStrengthText >= 0 ? parseFloat(signalStrengthDecimalText) : -parseFloat(signalStrengthDecimalText));
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
                        signalMeter.style.margin = '9px 0 0 ' + margin;
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

            // Add hover effect for opacity when opacity is 0%
            signalMeter.addEventListener('mouseover', function() {
                const currentOpacity = signalMeter.style.opacity;
                if (currentOpacity === '0') {
                    signalMeter.style.opacity = '0.2';
                }
            });

            // Remove hover effect when mouse leaves
            signalMeter.addEventListener('mouseleave', function() {
                const currentOpacity = signalMeter.style.opacity;
                if (currentOpacity === '0.2') {
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
        const normalizedStrength = ((signalValue + 35) / (132)) * 100;
        needlePosition = Math.min(normalizedStrength * maxPosition, 256);

        // Calculate the peak needle position
        const normalizedStrengthHighest = ((signalValueHighest + 35) / (132)) * 100;
        needlePositionHighest = Math.min(normalizedStrengthHighest * maxPosition, 256);

        // Low signal interpolation
        if (enableLowSignalInterpolation) {
        var sRepValue = 68; // Value in px of the reported TEF noise floor
        var sIntValue = 24; // Value in px of the interpolated noise floor
        var sMaxValue = 86; // Value in px where signal begins to deviate
            if (needlePosition < sMaxValue) { needlePosition = sIntValue + (needlePosition - sRepValue) * (sMaxValue - sIntValue) / (sMaxValue - sRepValue); }
            if (needlePositionHighest < sMaxValue) { needlePositionHighest = sIntValue + (needlePositionHighest - sRepValue) * (sMaxValue - sIntValue) / (sMaxValue - sRepValue); }
        }

        // Never fall below line starting position
        needlePosition = Math.max(needlePosition, 9);
        needlePositionHighest = Math.max(needlePositionHighest, 9);

        // Image signal locations in pixels:
        // 0, 16 | 1, 28 | 2, 40 | 3, 52 | 4, 64 | 5, 76 | 6, 88 | 7, 100 | 8, 112 | 9, 124 | +10, 144 | +20, 164 | +30, 184 | +40, 204 | +50, 224 | +60, 244
        if (debugMode) { console.log('normalizedStrength: ' + Math.round(normalizedStrength), '|| needlePosition: ' + Math.round(needlePosition), '|| signalStrength: ' + (signalStrength).toFixed(1), '|| signalStrengthHighest: ' + (signalStrengthHighest).toFixed(1)); }

        ctx.beginPath();
        ctx.moveTo(8, 0); // Start from the top left corner
        ctx.lineTo(Math.min((needlePositionHighest), signalMeter.width), 0); // Move horizontally to the right up to half width
        ctx.strokeStyle = '#333538'; // Grey
        ctx.lineWidth = 8;
        ctx.stroke();

        // Draw the first half of the needle in green
        ctx.beginPath();
        ctx.moveTo(8, 0); // Start from the top left corner
        ctx.lineTo(Math.min(needlePosition, (signalMeter.width / 2) - 4), 0); // Move horizontally to the right up to half width
        ctx.strokeStyle = '#08B818'; // Green
        if (debugMode) { if (needlePosition < sMaxValue) { ctx.strokeStyle = '#08FF18'; } }
        ctx.lineWidth = 8;
        ctx.stroke();

        // Draw the second half of the needle in red
        ctx.beginPath();
        ctx.moveTo((signalMeter.width / 2) - 4, 0); // Start from the top middle
        ctx.lineTo(Math.max((signalMeter.width / 2) - 4, needlePosition), 0); // Move horizontally to the right from half width
        ctx.strokeStyle = '#E01808'; // Red
        ctx.lineWidth = 8;
        ctx.stroke();
    }

    initAnalogMeterSmall();
})();
