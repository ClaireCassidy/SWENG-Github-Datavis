# README

## Motivation

This demo seeks to demonstrate access to the GitHub API using an authorisation token.

The app uses a React client which communicates parameterised requests to an Express server, which then contacts the GitHub API having attached the authorisation token in the header. This project requires Node to be installed on the user's machine.

## Setup

The app has been configured to launch at the following ports
    Server @ 127.0.0.1:8080
    Client @ 127.0.0.1:3000

Before attempting to send requests to the server, the user should navigate to the ``server`` folder and create a ``.env`` file at the top level.

In this file, one should add the line ``PAT=[your_github_access_token_here]``. One can also specify a different port for the server to run instead of 8080 on by adding ``PORT=[preferred_port]``.

Finally, dependencies should be installed by running ``npm install`` in the top-level folder and within the ``client`` folder.

Both the server and the client need to be launched simulataneously to be able to communicate. To launch the client, navigate to ``client`` folder and enter the command ``npm run start``. To run the server, navigate to the top-level folder and enter the command ``npm run server``.

## Using the App

Once the client and server are launched, one can open a browser window at the address 127.0.0.1:3000 to interact with the app. The app gives a selection of options for submitting requests to the API.

The first button **Contact Backend** is used to test if the client and server are communicating correctly. The server will respond with **"Backend says hello!"**.

The following three buttons give different ways of submitting requests to the GitHub API. One should enter the name of a GitHub user in the textbox before proceeding. 

The first two options simply show the raw output of a request to the GitHub API regarding a user and their repos respectively. The third option shows meaningful processing of this data by extracting and summing the sizes of all of the user's public repositories.

Since the log of responses can grow large very quickly, the final button clears the log.