# Cordova BackgroundGeolocation resetOdometer timestamp bug example
`resetOdometer()` should return a `Promise<Location>`, but the `.timestamp`
field contains a string instead of a `Date`.
