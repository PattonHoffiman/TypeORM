import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import TransactionRepository from '../repositories/TransactionsRepository';

export default class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const repository = getCustomRepository(TransactionRepository);
    const transaction = await repository.findOne(id);

    if (!transaction) throw new AppError('Transaction does not exist', 404);

    await repository.remove(transaction);
  }
}
