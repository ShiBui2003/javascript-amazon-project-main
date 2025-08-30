import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.get('/orders', (req, res) => {
  fs.readFile('orders.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading orders file');
      return;
    }
    res.send(data);
  });
});

app.post('/orders', (req, res) => {
  const order = req.body;
  order.id = new Date().getTime().toString();

  fs.readFile('orders.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading orders file');
      return;
    }
    const orders = JSON.parse(data || '[]');
    orders.unshift(order);
    fs.writeFile('orders.json', JSON.stringify(orders, null, 2), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error writing orders file');
        return;
      }
      res.status(201).send(order);
    });
  });
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
