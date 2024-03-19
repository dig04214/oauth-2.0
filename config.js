const config = {
  'session': 'asjvhearilugbnfkjvb',
  'session_options': {
    createDatabaseTable: false,
    schema: {
      tableName: 'session',
      columnNames: {
        session_id: 'session_id',
        expires: 'exp',
        data: 'data'
      }
    }
  }
}


module.exports = config