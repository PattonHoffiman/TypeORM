import { getCustomRepository } from 'typeorm';

import Category from '../models/Category';
import Transaction from '../models/Transaction';

import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

export default class CreateBookedTransactionsService {
  public async execute(
    categories: Category[],
    transactions: Request[],
  ): Promise<Transaction[]> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const _transactions = transactionsRepository.create(
      transactions.map(transaction => ({
        title: transaction.title,
        value: transaction.value,
        type: transaction.type,
        category: categories.find(
          _category => _category.title === transaction.category,
        ),
      })),
    );

    await transactionsRepository.save(_transactions);
    return _transactions;
  }
}
