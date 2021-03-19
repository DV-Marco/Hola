var Connection = require('tedious').Connection;
var Request = require('tedious').Request;
var TYPES = require('tedious').TYPES;
const async = require('async');

// Create connection to database
var config = {
  server: 'localhost',
  authentication: {
      type: 'default',
      options: {
          userName: 'sa', // update me
          password: 'Mz32671666' // update me
      }
  },
  options: {
      encrypt: false,
      database: 'TEST'
  }
}

var connection = new Connection(config);

function Start(callback){
  console.log("Starting...");
  callback(null, 'Xiaomi Redmi A7', 8);
}

function Insert(codigo, nombre, cantidad, callback){
  console.log("Inserting " + nombre + " into Table...");

  request = new Request(
    'INSERT INTO productos(codigo, nombre, cantidad) VALUES(@codigo, @nombre, @cantidad);',
    function(err, rowCount, rows){
      if (err) {
        callback(err);
      } else {
        console.log(rowCount + ' row(s) inserted');
        callback(null);
      }
    }
  );
  request.addParameter('codigo', TYPES.Char, codigo);
  request.addParameter('nombre', TYPES.Char, nombre);
  request.addParameter('cantidad', TYPES.Int, cantidad);

  connection.execSql(request);
}

function Update(nombre, id, callback){
  console.log("Update " + nombre + "...");

  request = new Request(
    'UPDATE productos SET nombre=@nombre WHERE id=@id;',
    function(err, rowCount, rows){
      if (err){
        callback(err);
      } else {
        console.log(rowCount + " row(s) updated");
      }
    }
  );
  request.addParameter('nombre', TYPES.Char, nombre);
  request.addParameter('id', TYPES.Int, id)

  connection.execSql(request);
}

function Delete(nombre, callback){
  console.log("Deleting " + nombre + "from the Table...");

  request = new Request(
    'DELETE FROM productos WHERE nombre = @nombre',
    function (err, rowCount, rows){
      if (err){
        callback(err);
      } else {
        console.log(rowCount + " row(s) deleted");
      }
    }
  );
  request.addParameter('nombre', TYPES.Char, nombre);

  connection.execSql(request);
}

function Read(callback){
  console.log('Reading rows from the Table...');

  request = new Request(
    'SELECT codigo, nombre FROM productos',
    function(err, rowCount, rows) {
      if (err){
        callback(err);
      } else {
        console.log(rowCount, ' row(s) returned');
      }
    }
  );

  var result = "";
  request.on('row', function(columns){
    columns.forEach(function(column){
      if (column.value === null){
        console.log("null");
      } else {
        result += column.value + " ";
      }
    });
    console.log(result);
    result = "";
  });

  connection.execSql(request);
}

function Complete (err, result) {
  if (err){
    console.log(err);
  } else {
    console.log("Done!")
  }
}

connection.on('connect', function(err){
  if (err){
    console.log(err);
  } else {
    console.log("Connected");

    async.waterfall([
      Read
    ], Complete)
  }
});

connection.connect();