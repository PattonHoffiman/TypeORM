import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
export default class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();
    const incomeArray = transactions.filter(
      transaction => transaction.type === 'income',
    );
    const outcomeArray = transactions.filter(
      transaction => transaction.type === 'outcome',
    );

    const income = incomeArray.reduce((acc, transaction) => {
      return acc + Number(transaction.value);
    }, 0);

    const outcome = outcomeArray.reduce((acc, transaction) => {
      return acc + Number(transaction.value);
    }, 0);

    const total = income - outcome;

    return { income, outcome, total };
  }

  public async getTransactions(): Promise<Transaction[]> {
    const transactions = await this.find({
      relations: ['category'],
    });

    return transactions;
  }
}
