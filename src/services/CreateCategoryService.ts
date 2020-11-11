import { getRepository } from 'typeorm';

import Category from '../models/Category';

export default class CreateCategoryService {
  public async execute(category: string): Promise<Category> {
    const categoriesRepository = getRepository(Category);
    const existCategory = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (!existCategory) {
      const newCategory = categoriesRepository.create({ title: category });
      await categoriesRepository.save(newCategory);
      return newCategory;
    }

    return existCategory;
  }
}
