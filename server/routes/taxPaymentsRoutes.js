const express = require('express');
const router = express.Router();
const { TaxPayment } = require('../models');  // ✅ korrekt


router.post('/', async (req, res) => {  // vetëm '/'
    try {
      const { taxpayerName, taxId, amount, date } = req.body;
      const payment = await TaxPayment.create({ taxpayerName, taxId, amount, date });
      res.status(201).json(payment);
    } catch (error) {
      res.status(500).json({ message: "Error processing payment", error });
    }
  });
  

module.exports = router;
