const Contact = require('./schemas/contact');

const listContacts = async () => {
  const result = await Contact.find({});

  return result;
};

const getContactById = async contactId => {
  try {
    const result = await Contact.findById(contactId);

    return result;
  } catch (error) {
    return false;
  }
};

const removeContact = async contactId => {
  try {
    const result = await Contact.findByIdAndRemove(contactId);

    return result;
  } catch (error) {
    return false;
  }
};

const addContact = async body => {
  const result = await Contact.create(body);

  return result;
};

const updateContact = async (contactId, body) => {
  try {
    const result = await Contact.findByIdAndUpdate(
      contactId,
      { ...body },
      { new: true },
    );

    return result;
  } catch (error) {
    return false;
  }
};

const updateStatusContact = async (contactId, body) => {
  try {
    const { favorite } = body;
    const result = await Contact.findByIdAndUpdate(
      contactId,
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
