const express = require('express');
const path = require('path');
const chalk = require('chalk');

const app = express();

const PUBLIC_PATH = path.join(__dirname, '../public');
const DIST_PATH = path.join(__dirname, '../dist');
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(PUBLIC_PATH));
app.use(express.static(DIST_PATH));

app.get('/*', (req, res) => {
  res.sendFile(`${PUBLIC_PATH}/index.html`);
});

app.listen(PORT, () => {
  console.log(chalk.cyan(`App is listening on port ${PORT}`));
});