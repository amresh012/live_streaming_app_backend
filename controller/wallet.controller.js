// backend/controllers/wallet.controller.js
import User from '../models/user.model.js';

export const getWallet = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ balance: user.walletBalance });
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve wallet balance' });
  }
};

export const requestWithdrawal = async (req, res) => {
  const { amount } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (amount > user.walletBalance) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // In production, integrate with payout system (e.g. Stripe Connect)
    user.walletBalance -= amount;
    await user.save();

    res.json({ message: 'Withdrawal request submitted', remainingBalance: user.walletBalance });
  } catch (err) {
    res.status(500).json({ message: 'Withdrawal failed' });
  }
};
