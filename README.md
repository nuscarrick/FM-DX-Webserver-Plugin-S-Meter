# S-Meter plugin for FM-DX-Webserver

This plugin displays a signal meter below the signal data.

Displayed outside or within the SIGNAL container, your choice.

![outside_true](https://github.com/AmateurAudioDude/FM-DX-Webserver-Plugin-S-Meter/assets/168192910/b79fcfb9-3071-45e8-8042-cc9cf64b6b26)   
![outside_false](https://github.com/AmateurAudioDude/FM-DX-Webserver-Plugin-S-Meter/assets/168192910/dfcd57c4-dfc8-416e-b0c2-6754fed6e8cc)

* [Download the latest zip file](https://github.com/AmateurAudioDude/FM-DX-Webserver-Plugin-S-Meter/archive/refs/heads/main.zip)
* Transfer `SignalMeterSmall` folder, and `SignalMeterSmall.js` to FM-DX-Webserver `plugins` folder
* Restart FM-DX-Webserver if required
* Login to Adminstrator Panel and enable plugin

## Options (found at the beginning of `pluginSignalMeterSmall.js`)

`isOutsideField`: Where the S-Meter is to be displayed, within the SIGNAL field, or below it.

`enableLowSignalInterpolation`: Because approximately -120dBm is the reported noise floor with TEF receivers, the S-Meter will never fall below this level (approx. S4). This attempts to calculate and correct those values based on the signals below -114dBm (just below S6), where true signal deviation from reported signal begins.

Simple calibration of `sRepValue` variable: Disconnect antenna and find the quietest noise floor. Adjust value of variable for meter to read just below S1.

v1.1.5
------
* Improved alignment based on window dimensions

v1.1.4
------
* Fix for some cases of canvas being cropped

v1.1.3
------
* Corrected decimal place calculations for all signal units

v1.1.2
------
* Aligned signal meter appearance and positioning

v1.1.1
------
* Added option `enableLowSignalInterpolation`
* Signal strength decimal place included in calculations

v1.1
----
* Visual improvements
* Corrected slight signal inaccuracies
* Added lighter grey bar to display signal peak (for current frequency)
* Removed separate image file
* Optional placement within or outside SIGNAL field (edit `pluginSignalMeterSmall.js`)

v1.0
----
* Public release

Original source code located at: https://github.com/NO2CW/FM-DX-Webserver-analog-signal-meter
