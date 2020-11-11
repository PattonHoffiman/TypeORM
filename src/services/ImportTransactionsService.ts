import fs from 'fs';
import csvParse from 'csv-parse';

import Transaction from '../models/Transaction';

import CreateBookedCategoriesService from './CreateBookedCategoriesService';
import CreateBookedTransactionsService from './CreateBookedTransactionsService';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

export default class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const categories: string[] = [];
    const transactions: Request[] = [];

    const readStream = fs.createReadStream(filePath);
    const parsers = csvParse({ from_line: 2 });
    const parseCSV = readStream.pipe(parsers);

    parseCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      );

      if (!title || !type || !value || !category) return;

      categories.push(category);
      transactions.push({ title, value, type, category });
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    const createCategories = new CreateBookedCategoriesService();
    const createTransactions = new CreateBookedTransactionsService();

    const _categories = await createCategories.execute(categories);
    const _transactions = await createTransactions.execute(
      _categories,
      transactions,
    );

    await fs.promises.unlink(filePath);

    return _transactions;
  }
}
