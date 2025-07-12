import { AppDataSource } from './config/ormconfig';
import { Tag } from './entities/Tag';

const predefinedTags = [
  { name: 'javascript', description: 'JavaScript programming language' },
  { name: 'react', description: 'React.js library for building user interfaces' },
  { name: 'typescript', description: 'TypeScript programming language' },
  { name: 'node.js', description: 'Node.js runtime environment' },
  { name: 'python', description: 'Python programming language' },
  { name: 'css', description: 'Cascading Style Sheets' },
  { name: 'html', description: 'HyperText Markup Language' },
  { name: 'api', description: 'Application Programming Interface' }
];

async function seedTags() {
  try {
    await AppDataSource.initialize();
    console.log('Database connection established');

    const tagRepository = AppDataSource.getRepository(Tag);

    for (const tagData of predefinedTags) {
      const existingTag = await tagRepository.findOne({ where: { name: tagData.name } });
      
      if (!existingTag) {
        const tag = tagRepository.create(tagData);
        await tagRepository.save(tag);
        console.log(`Created tag: ${tagData.name}`);
      } else {
        console.log(`Tag already exists: ${tagData.name}`);
      }
    }

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedTags(); 