const mongoose = require('mongoose');

/**
 * Atlas replica sets support multi-document transactions.
 * Local standalone MongoDB does not — fall back to sequential writes.
 */
const replicaSupportsTransactions = () => {
  const type = mongoose.connection.client?.topology?.description?.type;
  return ['ReplicaSetWithPrimary', 'Sharded', 'LoadBalanced'].includes(type);
};

const runInTransaction = async (work) => {
  if (!replicaSupportsTransactions()) {
    return work(null);
  }

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const result = await work(session);
    await session.commitTransaction();
    return result;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

module.exports = { runInTransaction, replicaSupportsTransactions };
