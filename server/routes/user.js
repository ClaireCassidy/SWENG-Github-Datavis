const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Hello world");
})
// get a user
router.get('/:username', (req, res) => {
    res.send(`Got it! Hello ${req.params.username}`);
});

module.exports = router;