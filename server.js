var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');


let app = express();

// //view Engine
// app.set('views',path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
// app.engine('html', require('ejs').renderFile);

app.use(express.static(path.join(__dirname,'dist')))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

let router = express.Router();  

router.get('/', (req,res,next) =>{
  res.render('index.html');
})

let mongojs = require('mongojs');
let db = mongojs('mongodb://hiepxanh:hiepxanh@ds041536.mlab.com:41536/project104',['todos']);

// Get All todos
router.get('/todos', (req,res,next) =>{
  db.todos.find((err,todos) => {
    if(err) {
      res.send(err);
    } else {
      res.json(todos);
    }
  });
})

// Get single todo
router.get('/todos/:id', (req,res,next) => {

  db.todos.findOne({
    _id: mongojs.ObjectId(req.params.id)
  }, (err,todo) => {
    if (err) {
      res.send(err);
    } else {
      res.json(todo);
    }
  })

});

// Create new todo
router.post('/todos', (req,res,next) => {

  var todo = req.body;
  console.log(todo);
  if (!(todo.text) || !(todo.iscompleted + '')) {
    res.status(400);
    res.json({
      "error":"Invalid Data"
    });
  } else {
    db.todos.save(todo, (err, result) => {
      if(err) {
        res.send(err);
      } else {
        res.json(result);
      }
    })
  }

})


// Update Todo
router.put('/todos/:id', function(req, res, next){
    var todo = req.body;
    console.log("todo is:" + todo);
    var updObj = {};

    if(todo.isCompleted){
        console.log("todo status is :" + todo.isCompleted);
        updObj.isCompleted = todo.isCompleted;
    }

    if(todo.text){
        updObj.text = todo.text;
    }

    if(!updObj){
        res.status(400);
        res.json({
            "error": "Invalid Data"
        });
    } else {
        db.todos.update({
            _id:mongojs.ObjectId(req.params.id)
        }, updObj, {}, function(err, result){
            if(err){
                res.send(err);
            } else {
                res.json(result);
            }
        });
    }
});

// Delete todo:
router.delete('/todos/:id', (req,res,next) => {

  db.todos.remove({
    _id: mongojs.ObjectId(req.params.id)
  }, '', (err,result) => {
    if(err) {
      res.send(err);
    } else {
      res.json(result);
    }
  })

})

app.listen( process.env.PORT || 8080, () => {
  console.log('magic happen on port 8080 ...');
})
