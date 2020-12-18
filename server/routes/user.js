const axios = require('axios');
const express = require('express');
const userRouter = express.Router();

userRouter.get('/', (req, res) => {
    res.send("Hello world");
})

// const sizeRouter = require('./size');
// userRouter.use('/:username/size', sizeRouter);

// get a user
userRouter.get('/:username', async (req, res) => {
    const greeting = `Got it! Hello ${req.params.username}`;

    try {
    // let responseBody = null;

    // axios
    // .get(`https://api.github.com/search/users?q=${req.params.username}`)
    // .then((response) => {
    //     responseBody = response.data;
    //     console.log("SUCCESS:"+response.data);
    // })
    // .catch((error) => {
    //     console.log("ERROR:"+error.response);
    //     responseBody = error.response;
    // });

    const responseBody = await getUserData(req.params.username);
    console.log(typeof responseBody)
    if (responseBody) {
        res.send(responseBody);
    } else {
        res.send("Error");
    }
} catch (err) {
    console.log(err);
}
    // res.send(greeting+"\n"+JSON.stringify(responseBody));
    //res.json({"name":`${req.params.username}`});
    //res.json(responseBody)
});

// get size
userRouter.get('/:username/size', (req, res) => {
    res.send("Working");
})

// query github api for user
async function getUserData(username) {
    try {
        const res = await axios.get(`https://api.github.com/search/users?q=${username}`, {
            'headers': {
                'Authorization': `token ${process.env.PAT}` 
            }
        });
        //return response.items[0].login+":"+response.items[0].id;
        console.log(res.data);
        return res.data;
    } catch (err) {
        console.log(err);
    }
}

module.exports = userRouter;