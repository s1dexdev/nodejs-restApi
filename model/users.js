const User = require('./schemas/user');

const findById = async id => {
  return await User.findById(id);
};

const findByEmail = async email => {
  return await User.findOne({ email });
};

const getUserByVerifyToken = async token => {
  return await User.findOne({ verifyToken: token });
};

const create = async options => {
  const user = new User(options);

  return await user.save();
};

const updateToken = async (id, token) => {
  return await User.findByIdAndUpdate(id, { token });
};

const updateSubscription = async (id, subscription) => {
  return await User.findByIdAndUpdate(id, { subscription }, { new: true });
};

const updateAvatar = async (id, avatarURL) => {
  return await User.updateOne({ _id: id }, { avatarURL });
};

const updateVerifyToken = async (id, verify, token) => {
  return await User.updateOne({ _id: id }, { verify, verifyToken: token });
};

module.exports = {
  findById,
  findByEmail,
  getUserByVerifyToken,
  create,
  updateToken,
  updateSubscription,
  updateAvatar,
  updateVerifyToken,
};
