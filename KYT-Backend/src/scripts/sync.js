const { get } = require('lodash');
const fixtures = require('sequelize-fixtures');
const models = require('../models');

console.log(process.env.NODE_ENV, '........sync.js.........');

async function syncDb() {
  console.log(
    'Rewriting tables------------------------------------------------------ :'
  );

  await models.EventHistory.sync({ force: true });
  await models.MomentHistory.sync({ force: true });
  await models.Segment.sync({ force: true });

  console.log(
    'Finished Rewriting tables >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>'
  );
}

async function fixSequences() {
  console.log(
    'Fixing sequences----------------------------------------------------- :'
  );

  const nextIncrement = result => {
    const count = parseInt(get(result, '[0].count', 0), 10);
    return count + 1;
  };

  const eventHistories = nextIncrement(
    await models.sequelize.query('SELECT COUNT(*) FROM "EventHistories"', {
      type: models.sequelize.QueryTypes.SELECT,
    })
  );
  const momentHistories = nextIncrement(
    await models.sequelize.query('SELECT COUNT(*) FROM "MomentHistories"', {
      type: models.sequelize.QueryTypes.SELECT,
    })
  );
  const segments = nextIncrement(
    await models.sequelize.query('SELECT COUNT(*) FROM "Segments"', {
      type: models.sequelize.QueryTypes.SELECT,
    })
  );


  await models.sequelize.query(
    `ALTER SEQUENCE "EventHistories_id_seq" RESTART WITH ${eventHistories};`
  );
  await models.sequelize.query(
    `ALTER SEQUENCE "MomentHistories_id_seq" RESTART WITH ${momentHistories};`
  );
  await models.sequelize.query(
    `ALTER SEQUENCE "Segments_id_seq" RESTART WITH ${segments};`
  );
  console.log(
    'Finished Fixing sequences >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>'
  );
}

async function syncAndLoad() {
  console.log(
    'Started Syncing db-------------------------------------------------------------- : '
  );

  await syncDb();

  try {
    await fixSequences();
  } catch (e) {
    console.error(
      e,
      '!!!!!!!!!!!!!!!!!!!error in sync.js!!!!!!!!!!!!!!!!!!!!!!!!!'
    );
  }

  console.log(
    'Finished Syncing db >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>'
  );

  process.exit(0);
}

syncAndLoad();

process.on('unhandledRejection', err => {
  console.log('Unhandled rejection', err);
});

process.on('uncaughtException', err => {
  console.log('Uncaught exception', err);
});
