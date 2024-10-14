router.post('/add', async (req, res) => {
    const { first_name, last_name, specialization, email, phone, schedule } = req.body;

    await db.query('INSERT INTO doctors (first_name, last_name, specialization, email, phone, schedule) VALUES (?, ?, ?, ?, ?, ?)', 
        [first_name, last_name, specialization, email, phone, schedule]);
    
    res.status(201).send('Doctor added successfully');
});
