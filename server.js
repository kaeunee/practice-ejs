const express = require('express');
const app = express();
app.use(express.urlencoded({extended: true}))
const MongoClient = require('mongodb').MongoClient;
app.set('view engine', 'ejs');


app.use('/public', express.static('public')); //main.css public폴더 미들웨어 추가



var db;
MongoClient.connect('mongodb+srv://admin:dusvlf1234@cluster0.ysufo1g.mongodb.net/?retryWrites=true&w=majority', function(에러, client){
    
    if (에러) return console.log(에러)
    db = client.db('todoapp');
    app.listen(8080, function () {
    console.log('listening on 8080')
    });
});


app.get('/', function(req, res){
    db.collection('post').find().toArray(function(에러, 결과){
        console.log(결과);
        res.render('index.ejs', { post : 결과 });
    });

});

app.get('/write', function(req, res){
    db.collection('post').find().toArray(function(에러, 결과){
        console.log(결과);
        res.render('write.ejs', { post : 결과 });
    });
});

app.post('/add', function(req, res){
    res.send('Server success');
    db.collection('counter').findOne({name : '게시물수'}, function(에러, 결과){
        console.log(결과.totalPost)
        var 총게시물수 = 결과.totalPost;
        
        db.collection('post').insertOne( { _id  : 총게시물수 + 1, 제목 : req.body.title, 날짜 : req.body.date } , function(에러, 결과){
            console.log('저장완료');
            db.collection('counter').updateOne({name:'게시물수'},{ $inc : {totalPost:+1} },function(에러, 결과){ // {$set:{totalPost:바꿀값}}
                if(에러){return console.log(에러)}
            });
            //counter 콜렉션 찾아서 1증가
        });
    });
});

// 1. DB에서 자료 파싱
// 2. 찾은 자료를 ejs 파일 안으로
app.get('/list', function(req, res){
//DB에 저장된 'post' collection안의 모든 데이터 꺼내와 주세요.
    db.collection('post').find().toArray(function(에러, 결과){
        console.log(결과);
        res.render('list.ejs', { posts : 결과 });
    });
});

app.delete('/delete', function(req, res){
    console.log(req.body)
    req.body._id = parseInt(req.body._id)
    db.collection('post').deleteOne(req.body, function(에러, 결과){
        console.log('서버도 삭제완뇨.');
        res.status(200).send({ message : 'server on!' });
    })
});


//url 파라미터
app.get('/detail/:id', function(req, res){
        db.collection('post').findOne({ _id : parseInt(req.params.id) }, function(에러, 결과){ // { 이런이름으로 : 이런데이터를 }
            console.log(결과);
            res.render('detail.ejs', { data : 결과 } )
        })
      });