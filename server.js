const express = require('express');
const app = express();
app.listen(8081,'127.0.0.1');
const dbService = require('./dbService.js');
const dataBase = new dbService();

function closeDB(){
    return dataBase.close();
}
function reject(err){
    closeDB().then(() => {throw err;});
}

function constructJsonResponse(rows){
    let itemsJSON = {};
    rows.forEach(function (row) {
        let second = row['second'];
        delete row['second'];
        if(itemsJSON[second] == undefined) {
            itemsJSON[second] = [];
        }
            itemsJSON[second].push(row);
    })
    return itemsJSON;
}


app.get('/api/items',function (req,res) {
    const quertString = 'SELECT * FROM items ORDER BY item_id';
    const filter = [];
    dataBase.query(quertString, filter).then(rows => {res.send(rows)},reject)
});

app.get('/api/:sec',function (req,res) {
    const sec = req.params.sec;
    const quertString = 'SELECT Name, Description, Link FROM items WHERE second = ? ';
    const filter = [sec];
    dataBase.query(quertString, filter).then( rows => {res.send(JSON.stringify(rows))},reject)
});


app.get('/api/getByVideo/:videoID',function (req, res) {
    const videoID = req.params.videoID;
    const quertString = 'SELECT Items.name, Items.description, Items.link, Items.price, Items.item_id,  Videos.second FROM Items INNER JOIN Videos ON Items.item_id = Videos.item_id WHERE Videos.id = ?';
    const filter = [videoID];
    dataBase.query(quertString, filter).then(constructJsonResponse, reject).then(data => {res.send(data)})
})

app.get('/api/getByVideoCode/:videoCode',function (req, res) {
    const videoCode = req.params.videoCode;
    console.log(videoCode);
    const url = "https://www.youtube.com/watch?v=" + videoCode;
    console.log(url);
    const quertString = 'SELECT Items.name, Items.link, Videos.second FROM Items INNER JOIN Videos ON Items.item_id = Videos.item_id WHERE Videos.link = ?';
    const filter = [url];
    dataBase.query(quertString, filter).then(constructJsonResponse, reject).then(data => {res.send(data)})
})

app.get('/api/getByVideo/:videoID/:second', function (req,res) {
    const videoID = req.params.videoID;
    const second = req.params.second;
    const quertString = 'SELECT Items.name, Items.description, Items.link, Items.price, Items.item_id FROM Items INNER JOIN Videos ON Items.item_id = Videos.item_id WHERE Videos.id = ? AND Videos.second = ?';
    const filter = [videoID,second];
    dataBase.query(quertString, filter).then(rows => {res.send(rows)})

});

