/*
    Signal Meter Small by AAD
    https://github.com/AmateurAudioDude/FM-DX-Webserver-Plugins
    https://github.com/NO2CW/FM-DX-Webserver-analog-signal-meter
*/

(function() {
    function initAnalogMeterSmall() {
        document.addEventListener('DOMContentLoaded', function() {
            const panels = Array.from(document.querySelectorAll('.panel-33'));
            const container = panels.find(panel => panel.querySelector('h2') && panel.querySelector('h2').textContent.includes('SIGNAL'));

            const signalMeter = document.createElement('canvas');
            signalMeter.id = 'signal-meter-small-canvas';
            signalMeter.style.width = '256px';
            signalMeter.style.height = '12px';
            signalMeter.style.margin = '4px 0 0 -128px';
            signalMeter.style.position = 'absolute';
            container.appendChild(signalMeter);

            // Override breadcrumbs.css to make this canvas visible
            document.getElementById('signal-meter-small-canvas').style.display = 'inline-block';

            // Add tooltip
            signalMeter.classList.add("tooltip");
            signalMeter.setAttribute('data-tooltip', 'Click to toggle show/hide S-Meter.');

            const ctx = signalMeter.getContext('2d');
            signalMeter.width = 256;
            signalMeter.height = 12;

            const backgroundImage = new Image();
            backgroundImage.src = 'images/signal-meter-small-background.png'; // Ensure path is correct
            backgroundImage.onload = function() {
                ctx.drawImage(backgroundImage, 0, 0, signalMeter.width, signalMeter.height);
            };

            setInterval(function() {
                const signalStrengthText = document.getElementById('data-signal') ? document.getElementById('data-signal').textContent : '0';
                let signalStrength = parseFloat(signalStrengthText);
                const textContent = localStorage.getItem('signalUnit');
                signalStrength += (textContent === 'dbm' ? 120 : textContent === 'dbuv' ? 11.25 : 0);

                // Resize if needed
                var width, margin;

                if (window.innerWidth > 768) {
                    switch (true) {
                        case (window.innerWidth <= 864):
                            width = '208px';
                            margin = '-104px';
                            break;
                        case (window.innerWidth <= 912):
                            width = '224px';
                            margin = '-112px';
                            break;
                        case (window.innerWidth <= 960):
                            width = '240px';
                            margin = '-120px';
                            break;
                        default:
                            width = '256px';
                            margin = '-128px';
                    }
                    signalMeter.style.width = width;
                    signalMeter.width = parseInt(width);
                    signalMeter.style.margin = '4px 0 0 ' + margin;
                } else {
                    width = '272px';
                    margin = '-136px';
                    signalMeter.style.width = width;
                    signalMeter.width = parseInt(width);
                    signalMeter.style.margin = '2px 0 0 ' + margin;
                }

                // Attempt to detect maximised window
                var isAtMaxWidth = screen.availWidth - window.innerWidth === 0;

                if (!(/Mobi|Android/i.test(navigator.userAgent)) && isAtMaxWidth) {
                    signalMeter.style.margin = '10px 0 0 ' + margin;
                }

                if (!isNaN(signalStrength)) {
                    drawSignalMeter(signalStrength, ctx, backgroundImage, signalMeter);
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

    function drawSignalMeter(signalValue, ctx, backgroundImage, signalMeter) {
        // Clear the canvas before redrawing
        ctx.clearRect(0, 0, signalMeter.width, signalMeter.height);

        // Redraw the background image
        ctx.drawImage(backgroundImage, 0, 0, signalMeter.width, signalMeter.height);

        // Draw the dark gray line in the background
        ctx.beginPath();
        ctx.moveTo(8, 0); // Start from the top left corner
        ctx.lineTo(signalMeter.width, 0); // Move horizontally to the right
        ctx.strokeStyle = '#212223';
        ctx.lineWidth = 8;
        ctx.stroke();

        // Calculate the needle position
        const normalizedStrength = ((signalValue + 36) / (130)) * 100; // Normalize the signal value between 0 and 1
        const maxPosition = (signalMeter.width + 3) / 100; // Maximum position for the needle (subtract needle width)
        const needlePosition = normalizedStrength * maxPosition;

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
        ctx.strokeStyle = '#E81808'; // Red
        ctx.stroke();
    }

    initAnalogMeterSmall();
})();
