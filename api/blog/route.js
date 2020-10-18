const router = require('express').Router();

router.get('/get', (req, res) => {
    res.send("we are getting data");
});

module.exports = router;