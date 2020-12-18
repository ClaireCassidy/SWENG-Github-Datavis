const axios = require("axios");
const { response } = require("express");
const express = require("express");
const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  res.send("Hello world");
});

// get a user
userRouter.get("/:username", async (req, res) => {
  const greeting = `Got it! Hello ${req.params.username}`;

  try {
    const responseBody = await getUserData(req.params.username);
    console.log(typeof responseBody);
    if (responseBody) {
      res.send(responseBody);
    } else {
      res.send("Error");
    }
  } catch (err) {
    console.log(err);
  }
});

// get username's public    repos
userRouter.get("/:username/repo", async (req, res) => {
  try {
    const userResponseBody = await getUserData(req.params.username);
    console.log("FROM ROUTE: \n\n" + JSON.stringify(userResponseBody));

    if (userResponseBody) {
        const repoUrl = userResponseBody.items[0].repos_url;
        console.log(repoUrl);

        const repoResponseBody = await getRepoData(repoUrl);

        res.send(repoResponseBody);
    } else {
        res.send("Error");
    }
  } catch (err) {
    console.log(err);
  }
});

// query github api for user
async function getUserData(username) {
  try {
    const res = await axios.get(
      `https://api.github.com/search/users?q=${username}`,
      {
        headers: {
          Authorization: `token ${process.env.PAT}`,
        },
      }
    );
    console.log("FROM USER FETCHING FUNCTION: \n\n" + JSON.stringify(res.data));
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

// makes a request for a repo based on a url obtained 
//  by querying API for a username 
async function getRepoData(repoUrl) {
    try {
        const res = await axios.get(
          `${repoUrl}`,
          {
            headers: {
              Authorization: `token ${process.env.PAT}`,
            },
          }
        );
        //return response.items[0].login+":"+response.items[0].id;
        console.log("FROM REPO FETCHING FUNCTION: \n\n" + JSON.stringify(res.data));
        return res.data;
      } catch (err) {
        console.log(err);
      }
}

module.exports = userRouter;
