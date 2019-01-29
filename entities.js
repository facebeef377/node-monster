const Sequelize = require('sequelize');

const sequelize = new Sequelize('monsterek', 'monsterek', 'lcQPr4rdk51v4THx', {
    host: '87.98.236.38',
    dialect: 'mysql',
  
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
  
    // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
    operatorsAliases: false
  });

const Monsterek = sequelize.define('monsterek', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    type_id: Sequelize.INTEGER,
    quantity: {
        type: Sequelize.ENUM,
        values: ['low','medium','high','out_of_stock']
    },
    lat: Sequelize.FLOAT,
    lon: Sequelize.FLOAT,
    rate_good: Sequelize.INTEGER,
    rate_bad: Sequelize.INTEGER,
    rate_out_of_stock: Sequelize.INTEGER
  });

  const Monsterek_Type = sequelize.define('monsterek_type', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    name: Sequelize.STRING,
    image_src: Sequelize.STRING,
    sugar: Sequelize.BOOLEAN,
    coffeine: Sequelize.INTEGER,
    ratiry: {
        type: Sequelize.ENUM,
        values: ['a','s','ss','xl']
    }
  });

  //sequelize.sync()

  module.exports = { Monsterek_Type, Monsterek };
