'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.addSkills = (event, context, callback) => {
  const timestamp = new Date().getTime();
  const data = JSON.parse(event.body);
  
  console.log(data.length);
   data.forEach(element => {
  
       const params = {
        TableName: process.env.SKILLS_TABLE,
        Item: {
          id: uuid.v1(),
          name: element.name,
          percentage: element.percentage,
          checked: false,
          index: element.index,
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      };
    
      // write the todo to the database
      dynamoDb.put(params, (error) => {
        // handle potential errors
        if (error) {
          console.error(error);
          callback(null, {
            statusCode: error.statusCode || 501,
            headers: { 'Content-Type': 'text/plain' },
            body: 'Couldn\'t create the todo item.',
          });
          return;
        }
    
        // create a response
        const response = {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          },
          body: JSON.stringify(params.Item),
        };
        callback(null, response);
      });
   }); 

  
};
