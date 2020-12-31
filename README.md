# README

## Motivation

This application seeks to present a data visualisation of information retrieved from the GitHub API. Specifically, it asks the user to submit a username and lists the public repositories for that username. The user can then click a repository to display a panel showing a breakdown of several metrics related to the repository. The metrics I chose to visualise were related to tracking recent commit activity and the languages used in the repository. This is achieved by the use of 

1. A bar chart that groups recent commits by day, to give an overview of the days in which the user/team were most productive in terms of number of commits.
   - This graph is interactive, and the user can click on a bar to display a list of all the commits that were made on that particular day. The list also provides links to the commit so the user can easily view the code changes in detail on GitHub.
2. A line chart that graphs recent commit density, to also help visualise activity by tracking the time in days between a given commit and the previous commit. This is helpful as the bar chart cannot convey large gaps that may occur between commits. A y-value closer to 0 is desirable since this shows that the team were working consistently and pushing often. This can also be used to identify which portions of code were particularly time-consuming for the user/team as they will have a large y-value.
   - The user can also click on a *datapoint* (the point itself, not a line segment) to view information about that particular commit, similar to the bar chart. This can be used to identify the problem commits that took the user/team the most time.
3. A radial bar chart which visualises relative language usage in terms of KBs. The innermost bar represents the language with the most KBs of code written, and shows other languages as a fraction relative to this innermost bar. This metric is vulnerable to inflating the perceived usage of more verbose languages relative to less verbose languages (for example, Java vs. Haskell), but generally can identify the primary and secondary languages with a good degree of accuracy as the difference in KBs tends to be high.

Each of the graphs are interactive, and can be hovered over to reveal more information. The panel also contains dropdowns with more information on what the graphs aim to convey. 

## Technology
The app was developed with a React frontend, which passes parameterised requests to an Express server. The server then accepts the request and configures and sends the appropriate request to the GitHub API, and passes the response back to the client. The server is also responsible for embedding the personal access token in the request, which prevents rate limit issues.

For developing the graphs, I used the [ReCharts](https://recharts.org/en-US/) library.

## Setup

The app has been configured to launch at the following ports
    Server @ 127.0.0.1:8080
    Client @ 127.0.0.1:3000

Before attempting to send requests to the server, the user should navigate to the ``server`` folder and create a ``.env`` file at the top level.

In this file, one should add the line ``PAT=[your_github_access_token_here]``. One can also specify a different port for the server to run instead of 8080 on by adding ``PORT=[preferred_port]``. The server responses will be logged to the console on the client's end, and any 401 errors will mean that the access token wasn't configured correctly.

Finally, dependencies should be installed by running ``npm install`` in the top-level folder and within the ``client`` folder.

Both the server and the client need to be launched simulataneously to be able to communicate. To launch the client, navigate to ``client`` folder and enter the command ``npm run start``. To run the server, navigate to the ``server`` folder and enter the command ``npx nodemon .``.
