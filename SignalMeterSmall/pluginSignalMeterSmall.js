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
            signalMeter.style.height = '13px';
            signalMeter.style.imageRendering = 'pixelated';
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
            signalMeter.height = 13;

            const backgroundImage = new Image();
            backgroundImage.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAAMCAMAAAC6GZObAAAAB3RJTUUH6AYBCTY2SEie6QAAAAlwSFlzAAAK8AAACvABQqw0mAAAAOpQTFRFAP8Af/9/v/+//wAA/39//6+v/7+/////////////////////////////////////////////////////////////AP8Af/9//wAA/39/////////////////////////////////////////////////////////////////////////////f/9/////////////////////////////////////////////////////////////////////////////AP8A/zAw////////////////////////////////////////////h5eLSwAAAE50Uk5TAAAAAAAAAAAECAwQFBgcHyAjJygrLzAwMDAzNzs/Q0dLT1NXW19jZ2tvc3d7f3+Dh4uPk5ebn6Onq6+zt7u/w8fIyMvP09fb3+Pn6+/z2M/URgAAAkRJREFUSMfllVt3mkAUhUlNuwcBJabkBlTUJoRgNJJmEITxglFim///d/pQoyNOXE2Wecp5OvPNXmdm7TkHpPZ8xGR83pDyY7iVz2xAdxE6+MwGQGv9tsV7p6cHq/iY/MvWmefnh1uxf/aNMyCzjx9/rNe3t+t8PJYkaZXzfA+5JEnj8cGWAZNJkXzdLyuVSpPJIWeAHafXr3THyYm0io/Jtw04Oyttxf4Zb8Dr0yF3GkJuxpEh4j1KLQFWKaW+SN9IqFZATg9mQlWOkC7zofUH/Inl+9QtMuB6S6dSStVaHFU367U3dDsMiMKOkCeVCybiI10vCzDRdU9UqDJV6n0eMFwGOZlVWg8cagZkYEVO9fEF2R14V3Km84zqgBkyFJgd6DoZGWa6RDoF3B65M3ndDgPKl2IDYLTbopdmD0FZqCeZImwkaM9cUXtqf0duxCBzDlWBYS0Hhstfte1RW9GcVF4zzU5aJklVhgJr0vBGmQL58sBWYmsDL/I53U4D8JoB9eBOZMCdfHX/ljrxIHxar3y6oA3kVri68BIFHnKA6cuHTaa0duRH2ppZdB713CswFJjlEuoNV/V60ZxarEvCFlfvHQYQF1iIWroJI/r/BkDZIZXh5ggAuTJDjfEo8ICsQubyegSaGno/eUZ19Bn74xeYdQHvOpeVGTcC9034N7zuHR3wK2GiDTntT823NFIcZxsfTQNAjm7KUQPOM2N1J2PeC1KqqGf9ocKzmvzPrQI7moYj1R2Omi83rAHVLBypvO4vLbqZlIEXd4UAAAAASUVORK5CYII=';
            backgroundImage.onload = function() {
                ctx.drawImage(backgroundImage, 0, 0, signalMeter.width, signalMeter.height - 1);
            };

            checkWeatherPlugin();

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
        ctx.drawImage(backgroundImage, 0, 0, signalMeter.width, signalMeter.height - 1);

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

function checkWeatherPlugin() {
    // If the Weather plugin image height is an odd number, this creates blurry canvases and needs correcting
    let intervalCount = 0;

    function checkForImage() {
        const weatherImage = document.getElementById("weatherImage");

        // Check if the image element exists
        if (weatherImage) {
            clearInterval(interval);

            // Get the computed style of the image
            const imageStyle = getComputedStyle(weatherImage);

            // Calculate the displayed height and width based on scaling or other CSS properties
            const displayedHeight = weatherImage.naturalHeight * parseFloat(imageStyle.getPropertyValue('height')) / 100;
            const displayedWidth = weatherImage.naturalWidth * parseFloat(imageStyle.getPropertyValue('width')) / 100;

            // Check if the displayed height and width are odd or even
            const isHeightOdd = displayedHeight % 2 !== 0;
            const isWidthOdd = displayedWidth % 2 !== 0;

            // Log the displayed height and width, and whether they're odd or even to the console
            //console.log("Displayed image height:", displayedHeight);
            //console.log("Displayed image width:", displayedWidth);
            //console.log("Displayed height is", isHeightOdd ? "odd." : "even.");
            //console.log("Displayed width is", isWidthOdd ? "odd." : "even.");

            // If height or width is odd, increase both height and width by 1 pixel
            if (isHeightOdd || isWidthOdd) {
                const newHeight = isHeightOdd ? displayedHeight + 1 : displayedHeight;
                const newWidth = isWidthOdd ? displayedWidth + 1 : displayedWidth;

                // Apply new height and width to the image
                weatherImage.style.height = newHeight + "px";
                weatherImage.style.width = newWidth + "px";

                //console.log("Image height and width increased by 1 pixel to become even.");
            } else {
                //console.error("Canvas element not found.");
            }
        } else {
            intervalCount++;
            if (intervalCount < 10) {
                setTimeout(checkForImage, 1000);
            } else {
                //console.error("Image element not found after 10 seconds.");
            }
        }
    }

    const interval = setTimeout(checkForImage, 1000);
}
