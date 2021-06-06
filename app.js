const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const boolParser = require('express-query-boolean');

const contactsRouter = require('./routes/api/contacts');
const usersRouter = require('./routes/api/users');
const { HttpCode } = require('./helpers/constants');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use(boolParser());

app.use('/avatars', express.static(__dirname + '/public/avatars'));
app.use('/api/users', usersRouter);
app.use('/api/contacts', contactsRouter);

app.use((req, res) => {
  res
    .status(HttpCode.NOT_FOUND)
    .json({ status: 'error', code: HttpCode.NOT_FOUND, message: 'Not found' });
});

app.use((err, req, res, next) => {
  const code = err.status || HttpCode.INTERNAL_SERVER_ERROR;
  const statusError = err.status ? 'error' : 'fail';

  res.status(code).json({ status: statusError, code, message: err.message });
});

module.exports = app;
