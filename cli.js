#!/usr/bin/env node

import moment from 'moment-timezone'
import minimist from 'minimist'
import fetch from 'node-fetch'

const args = minimist(process.argv.slice(2))
let timezone = moment.tz.guess()

if (args.h) {
    try {
        console.log(`
        Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -t TIME_ZONE
        -h            Show this help message and exit.
        -n, -s        Latitude: N positive; S negative.
        -e, -w        Longitude: E positive; W negative.
        -t            Time zone: uses tz.guess() from moment-timezone by default.
        -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
        -j            Echo pretty JSON from open-meteo API and exit.
        `)
        process.exitCode = 0;
    } catch (err) {
        process.exitCode = 1;
    }
}

if (args.t) {
    timezone = args.t
}

let latitude = '35'
if (args.n) {
    latitude = args.n
} else if (args.s) {
    latitude = args.s
} else {
    console.log("Latitude must be in range")
}

let longitude = '79'
if (args.e) {
    longitude = args.e
} else if (args.w) {
    longitude = args.w
} else {
    console.log("Longitude must be in range")
}

// Make a request
const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&hourly=temperature_2m&daily=precipitation_hours&current_weather=true&timezone=' + timezone);
// Get the data from the request
const data = await response.json()

if (args.j) {
    console.log(data);
}

if (!args.h && !args.j) {
    console.log(data)

    const days = args.d

    if (days == 0) {
        console.log("today.")
    } else if (days > 1) {
        console.log("in " + days + " days.")
    } else {
        console.log("tomorrow.")
    }

    let target
    if (!args.d) {
        target = 1
    } else {
        target = args.d
    }

    if (data.daily.precipitation_hours[target] == 0) {
        console.log("You will not need your galoshes")
    } else {
        console.log("You might need your galoshes")
    }

}


