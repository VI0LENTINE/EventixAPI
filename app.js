// -- IMPORTS --
import 'dotenv/config';
import http from 'http';
import express from 'express';
import sql from 'mssql';
import performancesRouter from './routes.js';


// -- HTTP --
// http.createServer(function (req, res) {
//   res.writeHead(200, { 'Content-Type': 'text/html'});
//   res.write('hello world');
//   res.end();
// }).listen(3000);


// -- EXPRESS -- 
const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.send('Hello Express!');
});
app.use('/api/performances', performancesRouter);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


// -- MSSQL --
// async() => {
//     await sql.connect(/* connection string goes here*/);
//     const result = await sql.query`select * from Table`;
//     const records = result.recordset;
// }
