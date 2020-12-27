# README

## Motivation

This application seeks to present a data visualisation of information retrieved from the GitHub API.

## Setup

The app has been configured to launch at the following ports
    Server @ 127.0.0.1:8080
    Client @ 127.0.0.1:3000

Before attempting to send requests to the server, the user should navigate to the ``server`` folder and create a ``.env`` file at the top level.

In this file, one should add the line ``PAT=[your_github_access_token_here]``. One can also specify a different port for the server to run instead of 8080 on by adding ``PORT=[preferred_port]``. The server responses will be logged to the console on the client's end, and any 401 errors will mean that the access token wasn't configured correctly.

Finally, dependencies should be installed by running ``npm install`` in the top-level folder and within the ``client`` folder.

Both the server and the client need to be launched simulataneously to be able to communicate. To launch the client, navigate to ``client`` folder and enter the command ``npm run start``. To run the server, navigate to the ``server`` folder and enter the command ``npx nodemon .``.
