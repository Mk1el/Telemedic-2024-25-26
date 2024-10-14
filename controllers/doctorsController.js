const express = require('express');
router = express.Router()

router.get('/', (req,res)=>{
    res.send('List of Doctors')
})

module.exports = router;
