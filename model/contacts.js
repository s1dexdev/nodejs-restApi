const Contact = require('./schemas/contact');

const listContacts = async (userId, query) => {
  const { page = 1, limit = 5, offset = 0, favorite = null } = query;
  const optionsSearch = { owner: userId };

  if (favorite !== null) {
    optionsSearch.favorite = favorite;
  }

  const result = await Contact.paginate(optionsSearch, { page, limit, offset });
  const { docs: contacts, totalDocs: total } = result;

  return { contacts, total, limit, offset, page };
};

const getContactById = async (contactId, userId) => {
  try {
    const result = await Contact.findOne({
      _id: contactId,
      owner: userId,
    }).populate({ path: 'owner', select: 'email subscription -_id' });

    return result;
  } catch (error) {
    return false;
  }
};

const removeContact = async (contactId, userId) => {
  try {
    const result = await Contact.findByIdAndRemove(contactId, {
      owner: userId,
    });

    return result;
  } catch (error) {
    return false;
  }
};

const addContact = async body => {
  const result = await Contact.create(body);

  return result;
};

const updateContact = async (contactId, userId, body) => {
  try {
    const result = await Contact.findByIdAndUpdate(
      contactId,
      { owner: userId },
      { ...body },
      { new: true },
    );

    return result;
  } catch (error) {
    return false;
  }
};

const updateStatusContact = async (contactId, userId, body) => {
  try {
    const { favorite } = body;
    const result = await Contact.findByIdAndUpdate(
      contactId,
      { owner: userId },
      { favorite },
      { new: true },
    );

    return result;
  } catch (error) {
    return false;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
