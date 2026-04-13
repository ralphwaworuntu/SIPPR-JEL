import { congregants } from './schema';

console.log('--- congregants schema exported keys ---');
console.log(Object.keys(congregants).filter(k => !k.startsWith('Symbol')));

console.log('Is congregants.diakonia_type undefined?:', congregants.diakonia_type === undefined);
console.log('Is congregants.diakoniaType undefined?:', (congregants as any).diakoniaType === undefined);
