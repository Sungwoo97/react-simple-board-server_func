const cors = require('cors')
const express = require('express')
const app = express()
const port = 8000

//본문에서 넘어온 요청 파싱(변환) 미들웨어를 이용하여
app.use(express.json()); // json 형식으로 변환  { "name": "Alice", "age": "25" } 
app.use(express.urlencoded());  // { name: "Alice", age: "25" } 

var corsOptions = {
  // origin: 'http://example.com',
  origin: '*'  //모든 출처를 허용
}
app.use(cors(corsOptions));


const mysql      = require('mysql');
const db = mysql.createConnection({
  host     : 'localhost',
  user     : 'react_bbs',
  password : '12345',
  database: 'react_bbs'
});

db.connect();




/*
app.get('/', (req, res) => {
  const sql = "INSERT INTO requested (rowno) VALUES (1)";
  db.query(sql, (err, rows, fields)=> {
    if (err) throw err;
    res.send('성공')
    console.log('데이터 추가성공');
  });
})*/

app.get('/list', (req, res) => {
  const sql = "SELECT BOARD_ID, BOARD_TITLE, REGISTER_ID, DATE_FORMAT(REGISTER_DATE, '%Y-%m-%d') AS REGISTER_DATE FROM board";
  db.query(sql, (err, result)=> {
    if (err) throw err;
    res.send(result);
  });
})

app.get('/detail', (req, res) => {
  const id = req.query.id;
  const sql = "SELECT BOARD_TITLE, BOARD_CONTENT FROM board WHERE BOARD_ID = ? ";
  db.query(sql, [id], (err, result)=> {
    if (err) throw err;
    res.send(result);
  });
})

app.post('/insert', (req, res) => {
  let title = req.body.title;
  let content = req.body.content;
  const sql = "INSERT INTO board (BOARD_TITLE, BOARD_CONTENT, REGISTER_ID) VALUES ( ?, ?, 'admin')";
  db.query(sql, [title, content] ,(err, result)=> {
    if (err) throw err;
    res.send(result);
  });
})

app.post('/update', (req, res) => {
  // let id = req.body.id;
  // let title = req.body.title;
  // let content = req.body.content;
  const {id, title, content} = req.body;
  const sql = "UPDATE board SET BOARD_TITLE = ?, BOARD_CONTENT = ? WHERE BOARD_ID = ?";
  db.query(sql, [title, content, id] ,(err, result)=> {
    if (err) throw err;
    res.send(result);
  });
})

app.post('/delete', (req, res) => {
  // const boardIdList = req.body.boardIdList
  const {boardIDList} = req.body;
  const sql = `DELETE FROM board WHERE BOARD_ID in ( ${boardIDList} )`;
  db.query(sql, (err, result)=> {
    if (err) throw err;
    res.send(result);
  });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// db.end();