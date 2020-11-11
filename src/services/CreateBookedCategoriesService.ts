import { getRepository, In } from 'typeorm';

import Category from '../models/Category';

export default class CreateBookedCategoriesService {
  public async execute(categories: string[]): Promise<Category[]> {
    const categoriesRepository = getRepository(Category);

    const listedCategories = await categoriesRepository.find({
      where: { title: In(categories) },
    });

    const listedTitles = listedCategories.map(category => category.title);

    const unregisteredCategories = categories
      .filter(category => !listedTitles.includes(category))
      .filter(
        (title, index, _categories) => _categories.indexOf(title) === index,
      );

    const newCategories = categoriesRepository.create(
      unregisteredCategories.map(title => ({ title })),
    );

    await categoriesRepository.save(newCategories);

    return [...newCategories, ...listedCategories];
  }
}
