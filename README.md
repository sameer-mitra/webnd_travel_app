# Travel App

## Introduction

This project is the final *capstone* project for Udacity's Front End Web Developer Nanodegree program. This is a travel application that provides the user information based on their selected destination and time of travel.

## Description

The user is asked for the following:

* A destination city 
* Date of departure 
* Date of return

The app will return:

* The city name, state or province (if applicable), and the respective country.
* Specific information about the country such as the country's capital, official language(s), currency information, and the flag.
* Weather conditions of the city, specifically the longitude/latitude region, on the selected *departure* day.

## Prerequisites

The project uses **NodeJS** and specifically **Express** to handle the server and middleware for client/server interactions. 

If you don't have NodeJS installed, download it here at [https://nodejs.org/en/download/](https://nodejs.org/en/download/).

The app also requires access to three APIs from the listed web services listed below. 

* Geonames ([Link](http://www.geonames.org))
* Weatherbit ([Link](https://www.weatherbit.io))
* Pixabay ([Link](https://pixabay.com))

Proceed to each website and follow their instructions to obtain an API key.  

## Installation

Copy the URL to this git repository: [https://github.com/sameer-mitra/webnd_travel_app](https://github.com/sameer-mitra/webnd_travel_app) and clone it to your local device within your respective *command prompt*.

Go the folder with your cloned copy of the app and type:

```
npm install or npm i
```

## Running the Application

After performing the installation steps above, the following commands ("*scripts*") are available to the user:

```
npm run build-dev (This builds the application for development purposes)
npm run build-prod (This builds the application for production. The end users will use this)
npm start (This starts the node server)
npm test (This runs tests associated with the project)
```

After building the dev code (npm run build-dev) and running the server (npm run start), the application is set to run on **port 8082**. You will see the message below in your command prompt:

```
Server Running
Running on localhost: 8082
```

Open a web browser and type in the following address:

```
http://localhost:8080/
```
