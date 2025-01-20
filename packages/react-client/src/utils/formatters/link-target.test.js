import { expect, it } from 'vitest';
import { linkTargetToCollection, linkTargetToLeaf } from '@/utils/formatters/link-target';
import { mockApplicationConfiguration, mockApplicationContext } from '@/utils/mocks';
it('creates link to a collection of things', () => {
    const repositoryName = 'Repository';
    expect(linkTargetToCollection('/types/collections/Things to Check Out', mockApplicationConfiguration, mockApplicationContext, repositoryName)).toEqual(`/${repositoryName}/types/collections/Things to Check Out#` +
        `/${mockApplicationConfiguration.applicationName}/${repositoryName}/types/collections/Things to Check Out`);
});
it('create a link to a single thing', () => {
    const repositoryName = 'Repository';
    expect(linkTargetToLeaf('/types/users/Tester Testly', mockApplicationConfiguration, mockApplicationContext, repositoryName)).toEqual(`/${repositoryName}/types/users#/` +
        `${mockApplicationConfiguration.applicationName}/${repositoryName}/types/users/Tester Testly`);
});
