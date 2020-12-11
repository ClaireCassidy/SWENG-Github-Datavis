const axios = require('axios');
const express = require('express');
const sizeRouter = express.Router({mergeParams: true});

sizeRouter.get('/', (req, res) => {
    res.send("HIIIIIII");
});

module.exports = router;