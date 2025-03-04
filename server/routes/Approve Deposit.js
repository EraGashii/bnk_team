router.put("/:id/approve", authenticateToken, async (req, res) => {
    try {
      const deposit = await Deposit.findByPk(req.params.id);
      if (!deposit) {
        return res.status(404).json({ message: "Deposit not found" });
      }
  
      // Approve deposit and update status
      deposit.status = "Approved";
      await deposit.save();
  
      res.json({ message: "Deposit approved", deposit });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  