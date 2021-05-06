const express = require('express');
const router = express.Router();
const { schemaPost, schemaPatch } = require('../../model/validation_schema');
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require('../../model/index');

router.get('/', async (req, res, next) => {
  try {
    const data = await listContacts();

    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.get('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const data = await getContactById(contactId);

    if (!data) {
      res.status(404).json({ message: 'Not found' });
    } else {
      res.json(data);
    }
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const data = await schemaPost.validateAsync(req.body);

    await addContact(data);
    res.status(201).json(data);
  } catch (error) {
    if (error.isJoi) {
      error.status = 400;
    }
    next(error);
  }
});

router.delete('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await removeContact(contactId);

    if (result) {
      res.json({ message: 'contact deleted' });
    } else {
      res.status(404).json({ message: 'Not found' });
    }
  } catch (error) {
    next(error);
  }
});

router.patch('/:contactId', async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const data = await schemaPatch.validateAsync(req.body);
    const { statusCode, result } = await updateContact(contactId, data);

    res.status(statusCode).json(result);
  } catch (error) {
    if (error.isJoi) {
      error.status = 400;
    }
    next(error);
  }
});

module.exports = router;
