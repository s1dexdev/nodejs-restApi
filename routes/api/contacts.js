const express = require('express');
const router = express.Router();
const { isValidObjectId } = require('mongoose');
const {
  validateCreateContact,
  validateUpdateContact,
  validateStatusContact,
} = require('./validation_schema');
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
} = require('../../model/index');

router.get('/', async (req, res, next) => {
  try {
    const contacts = await listContacts();

    return res.json({ status: 'success', code: 200, data: { contacts } });
  } catch (error) {
    next(error);
  }
});

router.get('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;

    if (!isValidObjectId(contactId)) {
      return res
        .status(404)
        .json({ status: 'error', code: 404, message: 'Invalid id' });
    }

    const contact = await getContactById(contactId);

    if (!contact) {
      return res
        .status(404)
        .json({ status: 'error', code: 404, message: 'Not found' });
    }

    return res.json({ status: 'success', code: 200, data: { contact } });
  } catch (error) {
    next(error);
  }
});

router.post('/', validateCreateContact, async (req, res, next) => {
  try {
    const contact = await addContact(req.body);

    return res
      .status(201)
      .json({ status: 'success', code: 201, data: { contact } });
  } catch (error) {
    next(error);
  }
});

router.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;

    if (!isValidObjectId(contactId)) {
      return res
        .status(404)
        .json({ status: 'error', code: 404, message: 'Invalid id' });
    }

    const result = await removeContact(contactId);

    if (!result) {
      return res
        .status(404)
        .json({ status: 'error', code: 404, message: 'Not found' });
    }

    return res.json({
      status: 'success',
      code: 200,
      message: 'contact deleted',
    });
  } catch (error) {
    next(error);
  }
});

router.put('/:contactId', validateUpdateContact, async (req, res, next) => {
  try {
    const { contactId } = req.params;

    if (!isValidObjectId(contactId)) {
      return res
        .status(404)
        .json({ status: 'error', code: 404, message: 'Invalid id' });
    }

    const contact = await updateContact(contactId, req.body);

    if (!contact) {
      return res
        .status(404)
        .json({ status: 'error', code: 404, message: 'Not found' });
    }

    return res
      .status(200)
      .json({ status: 'success', code: 200, data: { contact } });
  } catch (error) {
    next(error);
  }
});

router.patch(
  '/:contactId/favorite',
  validateStatusContact,
  async (req, res, next) => {
    try {
      const { contactId } = req.params;

      if (!isValidObjectId(contactId)) {
        return res
          .status(404)
          .json({ status: 'error', code: 404, message: 'Invalid id' });
      }

      const contact = await updateStatusContact(contactId, req.body);

      if (!contact) {
        return res
          .status(404)
          .json({ status: 'error', code: 404, message: 'Not found' });
      }

      return res
        .status(200)
        .json({ status: 'success', code: 200, data: { contact } });
    } catch (error) {
      next(error);
    }
  },
);

module.exports = router;
