import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import Transaction from '../models/Transaction';

import CreateCategoryService from './CreateCategoryService';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  category: string;
  type: 'income' | 'outcome';
}

export default class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const createCategory = new CreateCategoryService();
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    if (type === 'outcome') {
      const { total } = await transactionsRepository.getBalance();
      if (total - value < 0) throw new AppError('Invalid Value!', 400);
    }

    const _category = await createCategory.execute(category);
    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: _category,
    });

    await transactionsRepository.save(transaction);
    return transaction;
  }
}
