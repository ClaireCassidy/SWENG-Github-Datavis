const axios = require("axios");
const { response } = require("express");
const express = require("express");
const userRouter = express.Router();

userRouter.get("/", (req, res) => {
  res.send("Hello world");
});

// get a user
userRouter.get("/:username", async (req, res) => {
  try {
    const responseBody = await getUserData(req.params.username);

    if (responseBody && responseBody.total_count > 0) {
      res.send(responseBody);
    } else {
      res.send(`Error - does user ${req.params.username} exist?`);
    }
  } catch (err) {
    console.log(err);
  }
});

// get username's public repos
userRouter.get("/:username/repo", async (req, res) => {
  try {
    const userResponseBody = await getUserData(req.params.username);
    console.log("FROM ROUTE: \n\n" + JSON.stringify(userResponseBody));

    // need to check that the user exists before continuing => total_count > 0
    if (userResponseBody && userResponseBody.total_count > 0) {
      const repoUrl = userResponseBody.items[0].repos_url;
      console.log(repoUrl);

      const repoResponseBody = await getRepoData(repoUrl);

      res.send(repoResponseBody);
    } else {
      res.send(`Error - does user ${req.params.username} exist?`);
    }
  } catch (err) {
    console.log(err);
  }
});

// get a particular repo's languages:
userRouter.get("/:username/:repo/languages", async (req, res) => {
  try {
    const languagesRes = await getLanguageData(
      req.params.username,
      req.params.repo
    );
    console.log("FROM ROUTE: \n\n" + JSON.stringify(languagesRes));

    res.send(languagesRes);
    // res.send(JSON.stringify({
    //   username: req.params.username,
    //   repo: req.params.repo,
    //   getting: "languages"
    // }));
  } catch (err) {
    console.log(err);
  }
});

// fetch most recent 'amount' commits for the given repo
userRouter.get("/:username/:repo/commits/:amount", async (req, res) => {
  try {
    const commitsRes = await getNCommits(req.params.username, req.params.repo, req.params.amount);
    console.log("FROM ROUTE: \n\n" + JSON.stringify(commitsRes));

    res.send(commitsRes);
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
    const res = await axios.get(`${repoUrl}`, {
      headers: {
        Authorization: `token ${process.env.PAT}`,
      },
    });
    //return response.items[0].login+":"+response.items[0].id;
    console.log("FROM REPO FETCHING FUNCTION: \n\n" + JSON.stringify(res.data));
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

// fetch the language data for a particular repo
async function getLanguageData(username, repo) {
  try {
    const res = await axios.get(
      `https://api.github.com/repos/${username}/${repo}/languages`,
      {
        headers: {
          Authorization: `token ${process.env.PAT}`,
        },
      }
    );
    console.log(
      "FROM LANGUAGE FETCHING FUNCTION: \n\n" + JSON.stringify(res.data)
    );
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

// make a request to GitHub API for given amount of commits from a given user's named repo
async function getNCommits(username, repo, amount) {
  try {
    const res = await axios.get(
      `https://api.github.com/repos/${username}/${repo}/commits?per_page=${amount}`,
      {
        headers: {
          Authorization: `token ${process.env.PAT}`,
        },
      }
    );
    console.log(
      "FROM COMMIT FETCHING FUNCTION: \n\n" + JSON.stringify(res.data)
    );
    return res.data;
  } catch (err) {
    console.log(err);
  }
}

module.exports = userRouter;
