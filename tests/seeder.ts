import { Stack } from 'aws-cdk-lib';
import { Table, AttributeType } from 'aws-cdk-lib/aws-dynamodb';
import { Template } from 'aws-cdk-lib/assertions';
import { Seeder } from '../lib/index';

describe('seeder', () => {
  it('seeds a table from required json files', () => {
    const stack = new Stack();
    new Seeder(stack, 'Seeder', {
      table: new Table(stack, 'TestTable', {
        tableName: 'TestTable',
        partitionKey: { name: 'Id', type: AttributeType.STRING },
      }),
      setup: require('./put.json'),
      teardown: require('./delete.json'),
      refreshOnUpdate: true,
    });

    const template = Template.fromStack(stack);
    template.hasResource('AWS::Lambda::Function', {});
    template.hasResource('AWS::S3::Bucket', {});
  });

  it('seeds a table from inline arrays', () => {
    const stack = new Stack();
    new Seeder(stack, 'Seeder', {
      table: new Table(stack, 'TestTable', {
        tableName: 'TestTable',
        partitionKey: { name: 'Id', type: AttributeType.STRING },
      }),
      setup: [
        {
          id: 'herewego...',
          this: 'is a test',
          testing: {
            testing: 123,
          },
        },
        {
          id: 'greatest show',
          this: 'is a the greatest show',
        },
      ],
      teardown: [
        {
          id: 'greatest show',
        },
      ],
      refreshOnUpdate: true,
    });

    const template = Template.fromStack(stack);
    template.hasResource('AWS::Lambda::Function', {});
    template.hasResource('AWS::S3::Bucket', {});
  });
});
